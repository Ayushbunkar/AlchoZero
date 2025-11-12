import { describe, it, expect } from 'vitest';
import { isValidThreshold, isNonEmpty } from './validators';

describe('validators', () => {
  it('validates threshold in [0,1]', () => {
    expect(isValidThreshold(0)).toBe(true);
    expect(isValidThreshold(1)).toBe(true);
    expect(isValidThreshold(0.5)).toBe(true);
    expect(isValidThreshold(-0.1)).toBe(false);
    expect(isValidThreshold(1.1)).toBe(false);
    expect(isValidThreshold('abc')).toBe(false);
  });

  it('validates non-empty strings', () => {
    expect(isNonEmpty('hi')).toBe(true);
    expect(isNonEmpty('  ok  ')).toBe(true);
    expect(isNonEmpty('')).toBe(false);
    expect(isNonEmpty('   ')).toBe(false);
  });
});
