import { describe, expect, it } from "vitest";
import { calculateHabitProgress, calculateManualProgress, calculateMilestoneProgress, calculateMixedProgress, calculateNumericProgress, calculateTaskProgress } from "./calculations";

describe("progress calculations", () => {
  it("calculates task progress and ignores cancelled or excluded tasks", () => {
    expect(calculateTaskProgress([{ status: "done" }, { status: "todo" }, { status: "cancelled" }, { status: "done", excluded: true }])).toEqual({ displayPercent: 50, actualPercent: 50, denominator: 2 });
  });

  it("returns zero for an empty task list", () => {
    expect(calculateTaskProgress([]).displayPercent).toBe(0);
  });

  it("retains numeric achievement above the display cap", () => {
    expect(calculateNumericProgress(150, 100)).toEqual({ displayPercent: 100, actualPercent: 150, denominator: 100 });
  });

  it("does not divide by zero for numeric targets", () => {
    expect(calculateNumericProgress(10, 0).displayPercent).toBe(100);
    expect(calculateNumericProgress(0, 0).displayPercent).toBe(0);
  });

  it("uses milestone weights", () => {
    expect(calculateMilestoneProgress([{ status: "completed", weight: 2 }, { status: "in_progress", weight: 1 }])).toEqual({ displayPercent: 66.67, actualPercent: 66.67, denominator: 3 });
  });

  it("calculates manual percentages without losing overage", () => {
    expect(calculateManualProgress(108)).toEqual({ displayPercent: 100, actualPercent: 108, denominator: 100 });
  });

  it("calculates habit completion rates", () => {
    expect(calculateHabitProgress(3, 4).displayPercent).toBe(75);
    expect(calculateHabitProgress(0, 0).displayPercent).toBe(0);
  });

  it("calculates weighted mixed progress", () => {
    expect(calculateMixedProgress([{ percent: 80, weight: 3 }, { percent: 40, weight: 1 }]).actualPercent).toBe(70);
  });

  it("rejects invalid weights", () => {
    expect(() => calculateMilestoneProgress([{ status: "planned", weight: 0 }])).toThrow();
    expect(() => calculateMixedProgress([{ percent: 50, weight: -1 }])).toThrow();
  });
});