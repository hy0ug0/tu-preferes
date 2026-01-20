import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";

const ADMIN_SESSION_DURATION_MS = 1000 * 60 * 60 * 24;

/**
 * Verify admin PIN for protected mutations.
 * Requires ADMIN_PIN to be set in Convex environment variables.
 */
const verifyAdminPin = (adminPin: string) => {
  const expectedPin = process.env.ADMIN_PIN;

  if (!expectedPin) {
    throw new Error("ADMIN_PIN n'est pas configuré.");
  }

  if (!adminPin || adminPin !== expectedPin) {
    throw new Error("Non autorisé: PIN invalide");
  }
};

const verifyAdminSession = async (ctx: MutationCtx, adminToken: string) => {
  if (!adminToken) {
    throw new Error("Non autorisé: session manquante");
  }

  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", adminToken))
    .unique();

  if (!session) {
    throw new Error("Non autorisé: session invalide");
  }

  if (session.expiresAt <= Date.now()) {
    await ctx.db.delete(session._id);
    throw new Error("Non autorisé: session expirée");
  }
};

export const loginAdmin = mutation({
  args: { pin: v.string() },
  returns: v.object({
    token: v.string(),
    expiresAt: v.number(),
  }),
  handler: async (ctx, args) => {
    verifyAdminPin(args.pin);

    const token = crypto.randomUUID();
    const expiresAt = Date.now() + ADMIN_SESSION_DURATION_MS;

    await ctx.db.insert("adminSessions", {
      token,
      expiresAt,
    });

    return { token, expiresAt };
  },
});

export const logoutAdmin = mutation({
  args: { token: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return null;
  },
});

export const listActiveQuestions = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("questions"),
      _creationTime: v.number(),
      prompt: v.string(),
      choiceA: v.string(),
      choiceB: v.string(),
      countA: v.number(),
      countB: v.number(),
      isActive: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("questions")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();
  },
});

export const listAvailableQuestions = query({
  args: { deviceId: v.string() },
  returns: v.object({
    activeCount: v.number(),
    questions: v.array(
      v.object({
        _id: v.id("questions"),
        _creationTime: v.number(),
        prompt: v.string(),
        choiceA: v.string(),
        choiceB: v.string(),
        countA: v.number(),
        countB: v.number(),
        isActive: v.boolean(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const activeQuestions = await ctx.db
      .query("questions")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();

    const activeCount = activeQuestions.length;

    const historyEntries = await ctx.db
      .query("questionHistory")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .collect();

    const answeredQuestionIds = new Set(historyEntries.map((entry) => entry.questionId));

    const availableQuestions = activeQuestions.filter((q) => !answeredQuestionIds.has(q._id));

    return {
      activeCount,
      questions: availableQuestions,
    };
  },
});

export const listQuestions = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("questions"),
      _creationTime: v.number(),
      prompt: v.string(),
      choiceA: v.string(),
      choiceB: v.string(),
      countA: v.number(),
      countB: v.number(),
      isActive: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("questions").order("desc").collect();
  },
});

export const createQuestion = mutation({
  args: {
    prompt: v.string(),
    choiceA: v.string(),
    choiceB: v.string(),
    isActive: v.boolean(),
    adminToken: v.string(),
  },
  returns: v.id("questions"),
  handler: async (ctx, args) => {
    await verifyAdminSession(ctx, args.adminToken);
    return await ctx.db.insert("questions", {
      prompt: args.prompt,
      choiceA: args.choiceA,
      choiceB: args.choiceB,
      countA: 0,
      countB: 0,
      isActive: args.isActive,
    });
  },
});

export const updateQuestion = mutation({
  args: {
    questionId: v.id("questions"),
    prompt: v.string(),
    choiceA: v.string(),
    choiceB: v.string(),
    isActive: v.boolean(),
    adminToken: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await verifyAdminSession(ctx, args.adminToken);
    await ctx.db.patch(args.questionId, {
      prompt: args.prompt,
      choiceA: args.choiceA,
      choiceB: args.choiceB,
      isActive: args.isActive,
    });
    return null;
  },
});

export const deleteQuestion = mutation({
  args: { questionId: v.id("questions"), adminToken: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await verifyAdminSession(ctx, args.adminToken);

    const responses = ctx.db
      .query("responses")
      .withIndex("by_questionId", (q) => q.eq("questionId", args.questionId));

    for await (const response of responses) {
      await ctx.db.delete(response._id);
    }

    await ctx.db.delete(args.questionId);
    return null;
  },
});

export const submitResponse = mutation({
  args: {
    questionId: v.id("questions"),
    choice: v.union(v.literal("A"), v.literal("B")),
    deviceId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new Error("Question introuvable");
    }

    // Check if this device has already answered this question
    const existingHistory = await ctx.db
      .query("questionHistory")
      .withIndex("by_deviceId_and_questionId", (q) =>
        q.eq("deviceId", args.deviceId).eq("questionId", args.questionId),
      )
      .unique();

    if (existingHistory) {
      // Already answered, don't double-count
      return null;
    }

    const countA = question.countA + (args.choice === "A" ? 1 : 0);
    const countB = question.countB + (args.choice === "B" ? 1 : 0);

    await ctx.db.patch(args.questionId, {
      countA,
      countB,
    });

    await ctx.db.insert("responses", {
      questionId: args.questionId,
      choice: args.choice,
    });

    await ctx.db.insert("questionHistory", {
      deviceId: args.deviceId,
      questionId: args.questionId,
      choice: args.choice,
    });

    return null;
  },
});

export const getQuestionStats = query({
  args: { questionId: v.optional(v.id("questions")) },
  returns: v.object({
    countA: v.number(),
    countB: v.number(),
  }),
  handler: async (ctx, args) => {
    if (!args.questionId) {
      return { countA: 0, countB: 0 };
    }
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new Error("Question introuvable");
    }
    return {
      countA: question.countA,
      countB: question.countB,
    };
  },
});

export const resetHistory = mutation({
  args: { deviceId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const historyEntries = await ctx.db
      .query("questionHistory")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .collect();

    for (const entry of historyEntries) {
      await ctx.db.delete(entry._id);
    }

    return null;
  },
});
