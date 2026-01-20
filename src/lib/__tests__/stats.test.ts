import { describe, expect, it } from "vitest";
import { getChoicePercentages } from "../stats";

describe("getChoicePercentages", () => {
  it("returns zero when no responses", () => {
    expect(getChoicePercentages(0, 0)).toEqual({
      percentA: 0,
      percentB: 0,
      total: 0,
    });
  });

  it("splits percentages correctly", () => {
    expect(getChoicePercentages(2, 3)).toEqual({
      percentA: 40,
      percentB: 60,
      total: 5,
    });
  });
});
