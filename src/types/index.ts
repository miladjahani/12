export interface PadBounds {
  L: 'free' | 'wall' | 'attach';
  R: 'free' | 'wall' | 'attach';
  F: 'free' | 'wall' | 'attach';
  B: 'free' | 'wall' | 'attach';
}

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
  bounds: PadBounds;
  lat: number;
  emit: number;
  irrRate: number;
  grade: number;
  rec: number;
  dens: number;
}

export interface Terrain {
  sx: number;
  sy: number;
}
