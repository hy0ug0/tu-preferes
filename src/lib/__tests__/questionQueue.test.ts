import { describe, expect, it, vi } from "vitest";
import { nextIndex, shuffleQuestions } from "../questionQueue";

describe("nextIndex", () => {
  it("loops within bounds", () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(nextIndex(2, 3)).toBe(0);
  });

  it("handles empty list", () => {
    expect(nextIndex(0, 0)).toBe(0);
  });
});

describe("shuffleQuestions", () => {
  it("keeps all items", () => {
    const items = [{ _id: "a" }, { _id: "b" }, { _id: "c" }];
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = shuffleQuestions(items);
    expect(result).toHaveLength(3);
    expect(result.map((item) => item._id).sort()).toEqual(["a", "b", "c"]);
    vi.restoreAllMocks();
  });
});
