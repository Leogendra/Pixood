import * as Device from "expo-device";
import * as Localization from "expo-localization";
import { createContext, useContext, useEffect, useState } from "react";
import pkg from "../../package.json";
import { useSettings } from "./useSettings";


interface AnaylticsState {
  enable: () => void;
  disable: () => void;
  reset: () => void;
  track: (event: string, properties?: any) => void;
  identify: (properties?: {}) => void;
  isIdentified: boolean;
  isEnabled: boolean;
}

interface AnalyticsProviderProps {
  enabled: boolean;
}

const AnalyticsContext = createContext({
  enable: () => {},
  disable: () => {},
  reset: () => {},
  track: () => {},
  identify: () => {},
  isIdentified: false,
  isEnabled: false,
} as AnaylticsState);

const DEBUG = false;

function AnalyticsProvider({
  children,
  options = {
    enabled: false,
  },
}: {
  children: React.ReactNode;
  options?: AnalyticsProviderProps;
}) {
  // No-op analytics provider
  return (
    <AnalyticsContext.Provider value={{
      enable: () => {},
      disable: () => {},
      reset: () => {},
      track: () => {},
      identify: () => {},
      isIdentified: false,
      isEnabled: false,
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export { AnalyticsProvider };
export const useAnalytics = () => useContext(AnalyticsContext);
