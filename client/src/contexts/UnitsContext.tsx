import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UnitSystem = "USA" | "SI";

interface UnitLabels {
  length: string;
  lengthSmall: string;
  flow: string;
  velocity: string;
  area: string;
  volume: string;
  slope: string;
  rainfall: string;
  pressure: string;
  diameter: string;
  flowSmall: string;
}

interface ConversionFunctions {
  length: (val: number) => number;
  lengthSmall: (val: number) => number;
  flow: (val: number) => number;
  velocity: (val: number) => number;
  area: (val: number) => number;
  volume: (val: number) => number;
  rainfall: (val: number) => number;
  pressure: (val: number) => number;
  diameter: (val: number) => number;
  flowSmall: (val: number) => number;
}

interface UnitsContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  toggleUnits: () => void;
  u: UnitLabels;
  conv: ConversionFunctions;
  fmt: (val: number, decimals?: number) => string;
}

const usaLabels: UnitLabels = {
  length: "ft",
  lengthSmall: "in",
  flow: "cfs",
  velocity: "ft/s",
  area: "ft²",
  volume: "ft³",
  slope: "ft/ft",
  rainfall: "in/hr",
  pressure: "psi",
  diameter: "in",
  flowSmall: "gpm",
};

const siLabels: UnitLabels = {
  length: "m",
  lengthSmall: "mm",
  flow: "m³/s",
  velocity: "m/s",
  area: "m²",
  volume: "m³",
  slope: "m/m",
  rainfall: "mm/hr",
  pressure: "kPa",
  diameter: "mm",
  flowSmall: "L/s",
};

const identity = (val: number) => val;

const usaConversions: ConversionFunctions = {
  length: identity,
  lengthSmall: identity,
  flow: identity,
  velocity: identity,
  area: identity,
  volume: identity,
  rainfall: identity,
  pressure: identity,
  diameter: identity,
  flowSmall: identity,
};

const siConversions: ConversionFunctions = {
  length: (ft: number) => ft * 0.3048,
  lengthSmall: (inches: number) => inches * 25.4,
  flow: (cfs: number) => cfs * 0.0283168,
  velocity: (ftps: number) => ftps * 0.3048,
  area: (sqft: number) => sqft * 0.0929,
  volume: (cuft: number) => cuft * 0.0283168,
  rainfall: (inhr: number) => inhr * 25.4,
  pressure: (psi: number) => psi * 6.89476,
  diameter: (inches: number) => inches * 25.4,
  flowSmall: (gpm: number) => gpm * 0.0631,
};

const UnitsContext = createContext<UnitsContextType | null>(null);

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("USA");

  const toggleUnits = useCallback(() => {
    setUnitSystem((prev) => (prev === "USA" ? "SI" : "USA"));
  }, []);

  const u = unitSystem === "USA" ? usaLabels : siLabels;
  const conv = unitSystem === "USA" ? usaConversions : siConversions;
  const fmt = useCallback(
    (val: number, decimals: number = 2) => {
      return val.toFixed(decimals);
    },
    []
  );

  return (
    <UnitsContext.Provider
      value={{ unitSystem, setUnitSystem, toggleUnits, u, conv, fmt }}
    >
      {children}
    </UnitsContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error("useUnits must be used within a UnitsProvider");
  }
  return context;
}
