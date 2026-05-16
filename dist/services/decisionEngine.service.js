export const decisionEngineService = {
    decide: (...args) => ({ decision: "default", confidence: 0 }),
    run: (...args) => ({ results: [] })
};
