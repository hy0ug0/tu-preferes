import { mutation } from "./_generated/server";
import { v } from "convex/values";

const seedData = [
  {
    prompt:
      "Plus jamais pouvoir te doucher chez toi (tu peux te laver avec une éponge comme les sims mais bain interdit)",
    choiceA: "Plus jamais te doucher chez toi",
    choiceB: "Te doucher uniquement chez toi",
  },
  {
    prompt: "Qu'il fasse toujours 35° là où t'habites",
    choiceA: "Toujours 35°",
    choiceB: "Toujours 0°",
  },
  {
    prompt:
      "Plus pouvoir utiliser BeReal maintenant et à jamais ou devoir 1000€ si tu rates ton BeReal du jour (jusqu'à la fin de ta vie)",
    choiceA: "Plus jamais BeReal",
    choiceB: "Payer 1000€ si tu rates",
  },
];

export const seedQuestions = mutation({
  args: {
    reset: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (args.reset) {
      const existing = await ctx.db.query("questions").collect();
      for (const question of existing) {
        await ctx.db.delete(question._id);
      }
    }

    for (const seed of seedData) {
      await ctx.db.insert("questions", {
        prompt: seed.prompt,
        choiceA: seed.choiceA,
        choiceB: seed.choiceB,
        countA: 0,
        countB: 0,
        isActive: true,
      });
    }

    return null;
  },
});
