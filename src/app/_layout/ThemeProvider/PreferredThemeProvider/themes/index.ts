import { PreferredTheme } from "../constants";
import { BEMOBI_THEME, DARK_BEMOBI_THEME } from "./bemobi";

export const THEMES: {
  [key in PreferredTheme["name"]]: {
    [key in PreferredTheme["mode"]]: typeof BEMOBI_THEME;
  };
} = {
  bemobi: {
    light: BEMOBI_THEME,
    dark: DARK_BEMOBI_THEME,
  },
} as const;
