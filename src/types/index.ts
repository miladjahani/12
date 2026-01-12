// src/types/index.ts
export interface Pad {
  id: string;
  name: string;
  x: number;
  z: number;
  L: number;
  W: number;
  H: number;
  lift: number;
  slopeDeg: number;
  bounds: {
    L: 'free' | 'wall' | 'attach';
    R: 'free' | 'wall' | 'attach';
    F: 'free' | 'wall' | 'attach';
    B: 'free' | 'wall' | 'attach';
  };
  // Metallurgical & Irrigation params
  grade: number;
  rec: number;
  dens: number;
  irrRate: number;
  lat: number;
  emit: number;
}

export interface Terrain {
  sx: number;
  sy: number;
}
