module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'controllers/**/*.js',
    'services/**/*.js',
    'repositories/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**',
  ],
  testTimeout: 30000,
  verbose: true,
};
