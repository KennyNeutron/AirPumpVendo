// ui/lib/tire-data.ts
// Source: TireCodes.txt and TirePSI.txt

// Normalize input for consistent lookups.
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "").replace(/x/g, "X"); // bikes often use 'x'
}

export type PsiPair = { front: number; rear: number };

// Storage: normalized code -> PSI pair
const PSI_BY_CODE: Record<string, PsiPair> = {};

// Helper to map a whole list to a single PSI pair
function mapList(list: string[], pair: PsiPair) {
  list.forEach((c) => (PSI_BY_CODE[normalizeCode(c)] = pair));
}
// Helper to set a single code with PSI pair
function setOne(code: string, pair: PsiPair) {
  PSI_BY_CODE[normalizeCode(code)] = pair;
}

/* -------------------- CARS -------------------- */
// Small Cars & Sedan (Front 32 | Rear 34)
mapList(
  [
    "165/65R14",
    "175/65R14",
    "175/70R14",
    "185/60R14",
    "185/65R15",
    "185/70R14",
    "195/55R15",
    "195/60R15",
    "195/65R15",
    "195/50R16",
    "205/55R16",
    "205/60R15",
    "205/60R16",
    "205/65R15",
    "215/45R17",
    "215/50R17",
    "215/55R16",
    "215/55R17",
    "215/60R16",
    "225/45R17",
  ],
  { front: 32, rear: 34 }
);

// SUVs & Crossovers (Front 35 | Rear 38)
mapList(
  [
    "215/65R16",
    "215/70R16",
    "225/55R18",
    "225/60R17",
    "225/65R17",
    "225/70R16",
    "235/50R18",
    "235/55R18",
    "235/60R16",
    "235/60R18",
    "235/65R17",
    "235/70R16",
    "245/45R19",
    "245/50R20",
    "245/60R18",
    "245/65R17",
    "255/45R20",
    "255/50R19",
    "255/55R18",
    "255/60R18",
  ],
  { front: 35, rear: 38 }
);

// Pickups & Vans (Front 40 | Rear 45)
mapList(
  [
    "265/60R18",
    "265/65R17",
    "265/70R16",
    "265/70R17",
    "275/55R20",
    "275/60R20",
    "275/65R18",
    "285/60R18",
    "285/65R17",
    "285/70R17",
  ],
  { front: 40, rear: 45 }
);

/* -------------------- MOTORCYCLES -------------------- */
// Group (Front 30 | Rear 32)
mapList(
  [
    "2.50-17",
    "2.75-17",
    "2.75-18",
    "3.00-17",
    "3.00-18",
    "3.25-17",
    "3.25-18",
    "3.50-16",
    "3.50-17",
    "3.50-18",
    "3.75-16",
  ],
  { front: 30, rear: 32 }
);

// Group (Front 32 | Rear 36)
mapList(
  [
    "90/90-18",
    "100/90-17",
    "110/70-17",
    "110/80-17",
    "110/90-17",
    "120/60-17",
    "120/70-17",
    "120/80-17",
    "120/90-17",
    "130/70-17",
    "130/80-17",
    "140/60-17",
    "140/70-17",
  ],
  { front: 32, rear: 36 }
);

// Group (Front 36 | Rear 40)
mapList(
  [
    "130/90-17",
    "140/90-15",
    "150/60-17",
    "150/70-17",
    "160/60-17",
    "160/70-17",
  ],
  { front: 36, rear: 40 }
);

/* -------------------- BICYCLES -------------------- */
// Road Bike
setOne("700x23C", { front: 95, rear: 100 });
setOne("700x25C", { front: 90, rear: 95 });
setOne("700x28C", { front: 85, rear: 90 });
setOne("700x30C", { front: 80, rear: 85 });
setOne("700x32C", { front: 75, rear: 80 });
setOne("700x35C", { front: 70, rear: 75 });
setOne("700x38C", { front: 65, rear: 70 });
setOne("700x40C", { front: 60, rear: 65 });
setOne("700x42C", { front: 55, rear: 60 });
setOne("650x20C", { front: 100, rear: 105 });
setOne("650x23C", { front: 95, rear: 100 });
setOne("650x25C", { front: 90, rear: 95 });
setOne("650x28C", { front: 85, rear: 90 });

// Mountain Bike (26")
setOne("26x1.95", { front: 44, rear: 46 });
setOne("26x2.0", { front: 41, rear: 43 });
setOne("26x2.1", { front: 39, rear: 41 });
setOne("26x2.2", { front: 37, rear: 39 });
setOne("26x2.3", { front: 35, rear: 37 });

// Mountain Bike (27.5")
setOne("27.5x2.1", { front: 39, rear: 41 });
setOne("27.5x2.2", { front: 37, rear: 39 });
setOne("27.5x2.25", { front: 36, rear: 38 });
setOne("27.5x2.3", { front: 35, rear: 37 });
setOne("27.5x2.4", { front: 34, rear: 36 });
setOne("27.5x2.5", { front: 33, rear: 35 });

// Mountain Bike (29")
setOne("29x2.0", { front: 41, rear: 43 });
setOne("29x2.1", { front: 39, rear: 41 });
setOne("29x2.2", { front: 37, rear: 39 });
setOne("29x2.25", { front: 36, rear: 38 });
setOne("29x2.3", { front: 35, rear: 37 });
setOne("29x2.35", { front: 34, rear: 36 });
setOne("29x2.4", { front: 33, rear: 35 });
setOne("29x2.5", { front: 32, rear: 34 });

/* -------------------- Public API -------------------- */
export function isSupportedCode(raw: string): boolean {
  return !!PSI_BY_CODE[normalizeCode(raw)];
}

export function getPsiPair(raw: string): PsiPair | null {
  return PSI_BY_CODE[normalizeCode(raw)] ?? null;
}
