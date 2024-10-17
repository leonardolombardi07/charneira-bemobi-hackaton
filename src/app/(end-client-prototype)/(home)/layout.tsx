"use client";

import { usePreferredTheme } from "@/app/_layout/ThemeProvider";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = usePreferredTheme();
  const [isLoadingTheme, setIsLoadingTheme] = React.useState(true);

  React.useEffect(() => {
    setTheme(
      {
        ...theme,
        name: "vivo",
        mode: "light",
      },
      {
        cache: false,
      }
    );
    setIsLoadingTheme(false);
  }, [setTheme, theme]);

  if (isLoadingTheme) return null;

  return <React.Fragment>{children}</React.Fragment>;
}
