import { PreferredTheme } from "../constants";
import { BEMOBI_THEME, DARK_BEMOBI_THEME } from "./bemobi";
import { DARK_VIVO_THEME, VIVO_THEME } from "./vivo";

export const THEMES: {
  [key in PreferredTheme["name"]]: {
    [key in PreferredTheme["mode"]]: typeof BEMOBI_THEME;
  };
} = {
  bemobi: {
    light: BEMOBI_THEME,
    dark: DARK_BEMOBI_THEME,
  },
  vivo: {
    light: VIVO_THEME,
    dark: DARK_VIVO_THEME,
  },
} as const;
