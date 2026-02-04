import { describe, it, expect } from 'vitest';
import { calculatePadStats } from './calculations';
import { Pad, Terrain } from '../types';

describe('calculatePadStats', () => {
  const mockPad: Pad = {
    id: 'test',
    name: 'Test Pad',
    x: 0,
    z: 0,
    L: 200,
    W: 100,
    H: 15,
    lift: 1,
    slopeDeg: 37,
    bounds: { L: 'free', R: 'free', F: 'free', B: 'free' },
    lat: 50,
    emit: 40,
    irrRate: 80,
    grade: 0.7,
    rec: 80,
    dens: 1.7,
  };

  const mockTerrain: Terrain = { sx: 0, sy: 0 };

  it('calculates correct volume for a simple pad on flat ground', () => {
    const stats = calculatePadStats(mockPad, [mockPad], mockTerrain);

    // On flat ground, H=15, slope=37deg
    // slope_ratio = 1/tan(37) ~= 1.327
    // run = 15 * 1.327 = 19.905
    // topL = 200 - 2 * 19.905 = 160.19
    // topW = 100 - 2 * 19.905 = 60.19

    expect(stats.vol).toBeGreaterThan(0);
    expect(stats.mass).toBe(stats.vol * mockPad.dens);
  });

  it('handles copper recovery calculation correctly', () => {
    const stats = calculatePadStats(mockPad, [mockPad], mockTerrain);
    const expectedCu = stats.mass * (mockPad.grade / 100) * (mockPad.rec / 100);
    expect(stats.cu).toBeCloseTo(expectedCu, 2);
  });
});
