"use client";

import { Roboto } from "next/font/google";
import { ptBR } from "@mui/material/locale";
import { createTheme, responsiveFontSizes } from "@mui/material";
import { createResponsiveThemes } from "./utils";

const font = Roboto({
  weight: ["400"],
  subsets: ["latin"],
  style: "normal",
});

const VIVO_THEME = responsiveFontSizes(
  createTheme(
    {
      typography: {
        fontFamily: font.style.fontFamily,
      },

      palette: {
        mode: "light",
        primary: {
          main: "#609",
        },
        secondary: {
          main: "#cb2166",
        },
      },
    },
    ptBR
  )
);

const { dark: DARK_VIVO_THEME } = createResponsiveThemes(
  {
    typography: {
      fontFamily: font.style.fontFamily,
    },
    palette: {
      mode: "light",
    },
  },
  ptBR
);

export { VIVO_THEME, DARK_VIVO_THEME };
