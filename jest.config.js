module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    maxWorkers: 1,
    setupFiles: ["dotenv/config"],
    testPathIgnorePatterns: ["dist"]
};

