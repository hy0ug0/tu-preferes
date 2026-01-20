import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  adminSessions: defineTable({
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
  questions: defineTable({
    prompt: v.string(),
    choiceA: v.string(),
    choiceB: v.string(),
    countA: v.number(),
    countB: v.number(),
    isActive: v.boolean(),
  }).index("by_isActive", ["isActive"]),
  responses: defineTable({
    questionId: v.id("questions"),
    choice: v.union(v.literal("A"), v.literal("B")),
  }).index("by_questionId", ["questionId"]),
  questionHistory: defineTable({
    deviceId: v.string(),
    questionId: v.id("questions"),
    choice: v.union(v.literal("A"), v.literal("B")),
  })
    .index("by_deviceId", ["deviceId"])
    .index("by_deviceId_and_questionId", ["deviceId", "questionId"]),
});
