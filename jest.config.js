module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    maxWorkers: 1,
    setupFiles: ["dotenv/config"],
    'moduleNameMapper': {
        '@test-utils/(.*)': '<rootDir>/tests/http/utils/$1'
    }
};

