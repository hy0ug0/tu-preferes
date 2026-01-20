import { describe, expect, it } from "vitest";
import { runWithBusyState } from "../asyncState";

describe("runWithBusyState", () => {
  it("toggles busy state around async work", async () => {
    const states: Array<boolean> = [];
    const setBusy = (value: boolean) => states.push(value);

    const result = await runWithBusyState(setBusy, async () => {
      return "ok";
    });

    expect(result).toBe("ok");
    expect(states).toEqual([true, false]);
  });

  it("clears busy state when action throws", async () => {
    const states: Array<boolean> = [];
    const setBusy = (value: boolean) => states.push(value);

    await expect(
      runWithBusyState(setBusy, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    expect(states).toEqual([true, false]);
  });
});
