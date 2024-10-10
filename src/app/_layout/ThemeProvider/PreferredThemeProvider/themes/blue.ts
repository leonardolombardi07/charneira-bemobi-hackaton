"use client";

import { Poppins } from "next/font/google";
import { enUS } from "@mui/material/locale";
import { createResponsiveThemes } from "./utils";

const font = Poppins({
  weight: ["400"],
  subsets: ["latin"],
  style: "normal",
});

export const { light: BLUE_THEME, dark: DARK_BLUE_THEME } =
  createResponsiveThemes(
    {
      typography: {
        fontFamily: font.style.fontFamily,
      },
      palette: {
        mode: "light",
      },
    },
    enUS
  );
