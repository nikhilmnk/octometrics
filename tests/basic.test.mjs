import { validateUsername } from '../src/utils/validator.js';

describe('validateUsername', () => {
  test('should return true for valid username', () => {
    expect(validateUsername('validuser')).toBe(true);
  });

  test('should return false for invalid username', () => {
    expect(validateUsername('invalid-user!')).toBe(false);
  });
});