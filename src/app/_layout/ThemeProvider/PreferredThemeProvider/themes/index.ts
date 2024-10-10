import { PreferredTheme } from "../constants";
import { BLUE_THEME, DARK_BLUE_THEME } from "./blue";
import { DARK_BEMOBI_THEME, BEMOBI_THEME } from "./bemobi";

export const THEMES: {
  [key in PreferredTheme["name"]]: {
    [key in PreferredTheme["mode"]]: typeof BLUE_THEME;
  };
} = {
  blue: {
    light: BLUE_THEME,
    dark: DARK_BLUE_THEME,
  },
  ["bemobi"]: {
    light: BEMOBI_THEME,
    dark: DARK_BEMOBI_THEME,
  },
} as const;
