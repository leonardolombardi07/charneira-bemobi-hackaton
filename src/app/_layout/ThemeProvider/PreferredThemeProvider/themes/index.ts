import { PreferredTheme } from "../constants";
import { VIVO_THEME, DARK_VIVO_THEME } from "./vivo";

export const THEMES: {
  [key in PreferredTheme["name"]]: {
    [key in PreferredTheme["mode"]]: typeof VIVO_THEME;
  };
} = {
  vivo: {
    light: VIVO_THEME,
    dark: DARK_VIVO_THEME,
  },
} as const;
