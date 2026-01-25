// File: ui/lib/settings-context.tsx
// Path: ui/lib/settings-context.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DotInfo, parseDotCode } from "./dot-utils";

export interface TireCode {
  code: string;
  psi: number;
}

export interface Settings {
  password?: string;
  prices: {
    tireInfo: number;
    inflation: number;
  };
  services: {
    dotCheckEnabled: boolean;
  };
  dotCodes: DotInfo[];
  tireCodes: TireCode[];
}

const DEFAULT_SETTINGS: Settings = {
  password: "Admin123",
  prices: {
    tireInfo: 10,
    inflation: 20,
  },
  services: {
    dotCheckEnabled: true,
  },
  dotCodes: [
    "1017",
    "1021",
    "2018",
    "2023",
    "2212",
    "3015",
    "3522",
    "4519",
    "0124",
    "0514",
  ].map(parseDotCode),
  tireCodes: [
    { code: "205/55R16", psi: 32 },
    { code: "225/60R16", psi: 35 },
    { code: "215/65R17", psi: 33 },
    { code: "235/55R18", psi: 36 },
    { code: "255/45R20", psi: 38 },
  ],
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  addDotCode: (code: string, week: number, year: number) => void;
  removeDotCode: (code: string) => void;
  addTireCode: (code: string, psi: number) => void;
  removeTireCode: (code: string) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("app-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with default settings to ensure new fields (like password) exist
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("app-settings", JSON.stringify(settings));
    }
  }, [settings, loaded]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addDotCode = (code: string, week: number, year: number) => {
    // We can use parseDotCode but override week/year if provided,
    // or just trust the parser if we only take the code.
    // The UI allows manual entry, so let's construct it.
    // For now, let's just use the parser for consistency with the code string
    // but we might want to allow manual overrides in the future.
    // The current UI inputs are Code, Year, Week.

    // Re-calculating age/status based on inputs:
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentWeek = Math.ceil(
      ((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) /
        86400000 +
        1) /
        7,
    );

    let age = currentYear - year + (currentWeek - week) / 52;
    age = Math.round(age * 10) / 10;
    if (age < 0) age = 0;

    let status: "SAFE" | "CAUTION" | "REPLACE" = "SAFE";
    if (age > 10) status = "REPLACE";
    else if (age > 6) status = "CAUTION";

    const newDot: DotInfo = {
      code,
      week,
      year,
      ageYears: age,
      status,
    };

    setSettings((prev) => ({
      ...prev,
      dotCodes: [...prev.dotCodes, newDot],
    }));
  };

  const removeDotCode = (code: string) => {
    setSettings((prev) => ({
      ...prev,
      dotCodes: prev.dotCodes.filter((d) => d.code !== code),
    }));
  };

  const addTireCode = (code: string, psi: number) => {
    setSettings((prev) => ({
      ...prev,
      tireCodes: [...prev.tireCodes, { code, psi }],
    }));
  };

  const removeTireCode = (code: string) => {
    setSettings((prev) => ({
      ...prev,
      tireCodes: prev.tireCodes.filter((t) => t.code !== code),
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  if (!loaded) return null; // or a loading spinner

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        addDotCode,
        removeDotCode,
        addTireCode,
        removeTireCode,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
