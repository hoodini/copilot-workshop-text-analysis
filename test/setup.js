/**
 * Test Setup - Runs before all tests
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Set API timeout to be shorter in tests
process.env.API_TIMEOUT = '2000';
