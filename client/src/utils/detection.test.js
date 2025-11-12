import { describe, it, expect } from 'vitest';
import { statusFromConfidence } from './detection';

describe('statusFromConfidence', () => {
  it('maps confidence to status correctly', () => {
    expect(statusFromConfidence(0.1)).toBe('Normal');
    expect(statusFromConfidence(0.4)).toBe('Possible Impairment');
    expect(statusFromConfidence(0.69)).toBe('Possible Impairment');
    expect(statusFromConfidence(0.7)).toBe('High Risk');
    expect(statusFromConfidence(0.99)).toBe('High Risk');
  });
});
