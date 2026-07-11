export type Scenario = {
  id: string;
  name: string;
  createdAt: string;

  // Baseline
  baseNetWorth: number;
  baseIncome: number;
  baseExpenses: number;
  baseWorkHours: number;
  baseCommuteHours: number;
  baseChoresHours: number;

  // Changes
  newIncome: number;
  newExpenses: number;
  newWorkHours: number;
  newCommuteHours: number;
  newChoresHours: number;
  upfrontCost: number;
};
