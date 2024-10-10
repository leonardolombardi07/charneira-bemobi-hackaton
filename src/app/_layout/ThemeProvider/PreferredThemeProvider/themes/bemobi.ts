"use client";

import { Poppins } from "next/font/google";
import { ptBR } from "@mui/material/locale";
import { createTheme, responsiveFontSizes } from "@mui/material";

const font = Poppins({
  weight: ["400"],
  subsets: ["latin"],
  style: "normal",
});

const BEMOBI_THEME = responsiveFontSizes(
  createTheme(
    {
      typography: {
        fontFamily: font.style.fontFamily,
      },

      palette: {
        mode: "light",
        primary: {
          main: "#020f5b",
        },
        secondary: {
          main: "#46508a",
        },
        background: {
          default: "#ffffff",
          paper: "#ffffff",
        },
        text: {
          primary: "#020f5b",
          secondary: "#46508a",
        },
        info: {
          main: "#66aaff",
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: "8px",
              textTransform: "none",
              padding: "10px 16px",
            },
            containedPrimary: {
              backgroundColor: "#1e73be",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#1e73be",
              },
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
              },
            },
          },
        },
      },
    },
    ptBR
  )
);

const DARK_BEMOBI_THEME = responsiveFontSizes(
  createTheme(
    {
      typography: {
        fontFamily: font.style.fontFamily,
      },
      palette: {
        mode: "dark",
        primary: {
          main: "#ffffff",
        },
        secondary: {
          main: "#b8c6e5",
        },
        background: {
          default: "#020f4b",
          paper: "#020f5b",
        },
        text: {
          primary: "#ffffff",
          secondary: "#b8c6e5",
        },
        info: {
          main: "#66aaff",
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: "8px",
              textTransform: "none",
              padding: "10px 16px",
            },
            containedPrimary: {
              backgroundColor: "#ffffff",
              color: "#020f5b",
              "&:hover": {
                backgroundColor: "#ffffff",
              },
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
              },
            },
          },
        },
      },
    },
    ptBR
  )
);

export { BEMOBI_THEME, DARK_BEMOBI_THEME };
