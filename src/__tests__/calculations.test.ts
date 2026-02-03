import { describe, it, expect } from 'vitest';
import { calculatePadResults, Pad } from '../utils/heapCalculations';

describe('Heap Calculations', () => {
  const mockPad: Pad = {
    id: 'pad_1',
    name: 'Test Pad',
    x: 0, z: 0, L: 200, W: 100, H: 15, lift: 1,
    slopeDeg: 37,
    bounds: { L: 'free', R: 'free', F: 'free', B: 'free' },
    lat: 50, emit: 40, irrRate: 80,
    grade: 0.7, rec: 80, dens: 1.7
  };

  const mockTerrain = { sx: 0, sy: 0 };

  it('calculates correct volume for a simple box (slopeDeg=90)', () => {
    const boxPad = { ...mockPad, slopeDeg: 90 };
    const results = calculatePadResults(boxPad, mockTerrain, [boxPad]);
    expect(results.vol).toBeCloseTo(200 * 100 * 15);
  });

  it('calculates non-zero recoverable copper', () => {
    const results = calculatePadResults(mockPad, mockTerrain, [mockPad]);
    expect(results.cu).toBeGreaterThan(0);
    // mass = vol * 1.7
    // cu = mass * 0.007 * 0.8
    const expectedMass = results.vol * 1.7;
    const expectedCu = expectedMass * 0.007 * 0.8;
    expect(results.cu).toBeCloseTo(expectedCu);
  });

  it('handles irrigation calculations', () => {
    const results = calculatePadResults(mockPad, mockTerrain, [mockPad]);
    expect(results.emitCount).toBeGreaterThan(0);
    expect(results.flowRate).toBeGreaterThan(0);
  });
});
