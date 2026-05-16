export const decisionEngineService = {
  decide: (...args: any[]) => ({ decision: "default", confidence: 0 }),
  run: (...args: any[]) => ({ results: [] })
};

