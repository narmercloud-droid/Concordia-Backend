export const orchestrationService = {
    orchestrate: (...args) => ({ results: [] }),
    runAll: (...args) => ({ results: [] }),
    eventTrigger: (...args) => ({ triggered: true }),
    logs: (...args) => ({ logs: [] })
};
