export interface Pad {
  id: number;
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

export interface CalculationResults {
  cu: number;
  vol: number;
  acid: number;
  flow: number;
  mass: number;
  baseArea: number;
  topArea: number;
  topL: number;
  topW: number;
  emitCount: number;
  hTL: number;
  hTR: number;
  hBR: number;
  hBL: number;
  hipFL: number;
  hipFR: number;
  hipBL: number;
  hipBR: number;
  pipeLen: number;
  latLen: number;
}
