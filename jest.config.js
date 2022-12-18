module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['dist'],
  moduleNameMapper: {
    '@test-utils/(.*)': '<rootDir>/tests/http/utils/$1',
    '@src/(.*)': '<rootDir>/src/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
  },
};
