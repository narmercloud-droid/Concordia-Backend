module.exports = {
  roots: ["<rootDir>"],
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/src/agent/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/prisma/.*)\\.js$": "$1.ts",
    "^(\\.{1,2}/(AgentBrain|AgentWorkflow|IntentDetector))\\.js$": "$1.ts",
    "^(\\.{1,2}/src/.*)\\.js$": "$1.ts"
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      useESM: true,
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [151002]
      }
    }]
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/../admin-dashboard/",
    "<rootDir>/../*/admin-dashboard/"
  ]
};
