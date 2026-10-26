export type TaskProgressItem = { status: "todo" | "in_progress" | "done" | "cancelled"; excluded?: boolean };
export type MilestoneProgressItem = { status: "planned" | "in_progress" | "completed" | "cancelled"; weight: number; excluded?: boolean };

export type ProgressResult = {
  displayPercent: number;
  actualPercent: number;
  denominator: number;
};

const round = (value: number) => Math.round(value * 100) / 100;
const display = (value: number) => Math.min(100, Math.max(0, round(value)));

export function calculateTaskProgress(tasks: TaskProgressItem[]): ProgressResult {
  const eligible = tasks.filter((task) => !task.excluded && task.status !== "cancelled");
  const completed = eligible.filter((task) => task.status === "done").length;
  const actualPercent = eligible.length === 0 ? 0 : (completed / eligible.length) * 100;
  return { displayPercent: display(actualPercent), actualPercent: round(actualPercent), denominator: eligible.length };
}

export function calculateNumericProgress(current: number, target: number): ProgressResult {
  if (!Number.isFinite(current) || !Number.isFinite(target)) throw new Error("Numeric progress values must be finite.");
  if (target === 0) return { displayPercent: current === 0 ? 0 : 100, actualPercent: current === 0 ? 0 : 100, denominator: 0 };
  const actualPercent = (current / target) * 100;
  return { displayPercent: display(actualPercent), actualPercent: round(actualPercent), denominator: target };
}

export function calculateMilestoneProgress(milestones: MilestoneProgressItem[]): ProgressResult {
  const eligible = milestones.filter((milestone) => !milestone.excluded && milestone.status !== "cancelled");
  const totalWeight = eligible.reduce((sum, milestone) => {
    if (!Number.isFinite(milestone.weight) || milestone.weight <= 0) throw new Error("Milestone weights must be positive finite numbers.");
    return sum + milestone.weight;
  }, 0);
  const completedWeight = eligible.filter((milestone) => milestone.status === "completed").reduce((sum, milestone) => sum + milestone.weight, 0);
  const actualPercent = totalWeight === 0 ? 0 : (completedWeight / totalWeight) * 100;
  return { displayPercent: display(actualPercent), actualPercent: round(actualPercent), denominator: round(totalWeight) };
}

export function calculateManualProgress(percent: number): ProgressResult {
  if (!Number.isFinite(percent)) throw new Error("Manual progress must be finite.");
  return { displayPercent: display(percent), actualPercent: round(percent), denominator: 100 };
}

export function calculateHabitProgress(completedOccurrences: number, expectedOccurrences: number): ProgressResult {
  if (!Number.isInteger(completedOccurrences) || !Number.isInteger(expectedOccurrences) || completedOccurrences < 0 || expectedOccurrences < 0) throw new Error("Habit occurrences must be non-negative integers.");
  const actualPercent = expectedOccurrences === 0 ? 0 : (completedOccurrences / expectedOccurrences) * 100;
  return { displayPercent: display(actualPercent), actualPercent: round(actualPercent), denominator: expectedOccurrences };
}

export function calculateMixedProgress(parts: Array<{ percent: number; weight: number }>): ProgressResult {
  const totalWeight = parts.reduce((sum, part) => {
    if (!Number.isFinite(part.percent) || !Number.isFinite(part.weight) || part.weight <= 0) throw new Error("Mixed progress parts require finite percentages and positive weights.");
    return sum + part.weight;
  }, 0);
  const weightedPercent = parts.reduce((sum, part) => sum + part.percent * part.weight, 0);
  const actualPercent = totalWeight === 0 ? 0 : weightedPercent / totalWeight;
  return { displayPercent: display(actualPercent), actualPercent: round(actualPercent), denominator: round(totalWeight) };
}