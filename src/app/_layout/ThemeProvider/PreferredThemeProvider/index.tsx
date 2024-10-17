"use client";

import * as React from "react";
import { THEME_MODES, THEME_NAMES, PreferredTheme } from "./constants";

interface SetThemeOptions {
  cache?: boolean;
}

interface ThemeProviderContextValue {
  theme: PreferredTheme;
  setTheme: (theme: PreferredTheme, options?: SetThemeOptions) => void;
}

const PreferredThemeContext =
  React.createContext<ThemeProviderContextValue | null>(null);

function PreferredThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, _setTheme] = React.useState<PreferredTheme>(ThemeCache.get());

  const setTheme = React.useCallback(
    (
      theme: PreferredTheme,
      options: SetThemeOptions = {
        cache: true,
      }
    ) => {
      _setTheme(theme);
      if (!options.cache) return;
      ThemeCache.set(theme);
    },
    []
  );

  return (
    <PreferredThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </PreferredThemeContext.Provider>
  );
}

function usePreferredTheme() {
  const PreferredTheme = React.useContext(PreferredThemeContext);
  if (PreferredTheme === null) {
    throw new Error(
      "usePreferredTheme must be used within a PreferredThemeProvider"
    );
  }
  return PreferredTheme;
}

const DEFAULT_THEME: PreferredTheme = {
  name: "bemobi",
  mode: "light",
};

class ThemeCache {
  static get(): PreferredTheme {
    try {
      const theme = JSON.parse(window?.localStorage?.getItem("theme") || "");
      if (!this._validateTheme(theme)) return DEFAULT_THEME;
      return theme as PreferredTheme;
    } catch (error) {
      return DEFAULT_THEME;
    }
  }

  static set(theme: PreferredTheme) {
    if (!this._validateTheme(theme)) {
      throw new Error(`Invalid theme`);
    }

    try {
      window?.localStorage?.setItem("theme", JSON.stringify(theme));
    } catch (error) {
      throw new Error(`Algo deu errado ao salvar o tema`);
    }
  }

  private static _validateTheme(theme: PreferredTheme | undefined | null) {
    if (!THEME_NAMES.includes(theme?.name as any)) {
      return false;
    }
    if (!THEME_MODES.includes(theme?.mode as any)) {
      return false;
    }
    return true;
  }
}

export default PreferredThemeProvider;
export { usePreferredTheme };
export * from "./themes";
export type { PreferredTheme };
