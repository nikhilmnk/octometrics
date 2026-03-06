/**
 * Jest setup file for all tests
 * Runs before each test suite
 */
import { jest } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests

// Increase test timeout for API calls
jest.setTimeout(10000);

// Global test utilities
global.testHelpers = {
  // Mock GitHub profile response
  mockProfile: {
    login: 'nikhilmnk',
    public_repos: 2,
    followers: 1,
    following: 2,
  },

  // Mock repository response
  mockRepo: {
    name: 'Hello-World',
    language: 'JavaScript',
    stargazers_count: 80,
    forks_count: 9,
  },

  // Create mock request object
  createMockRequest: (query = {}) => ({
    query,
    method: 'GET',
    path: '/api/test',
  }),

  // Create mock response object
  createMockResponse: () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  }),
};
