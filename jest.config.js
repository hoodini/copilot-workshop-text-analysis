/**
 * Jest Configuration
 * 
 * Workshop participants will create/improve this using Copilot!
 */

module.exports = {
  testEnvironment: 'node',
  
  // Set NODE_ENV for tests
  setupFiles: ['<rootDir>/test/setup.js'],
  
  // Test file patterns
  testMatch: [
    '**/test/**/*.test.js',
    '**/test/**/*.spec.js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js' // Exclude main file from coverage (has server startup)
  ],
  
  // Timeout for async tests
  testTimeout: 10000,
  
  // Verbose output
  verbose: true
};
