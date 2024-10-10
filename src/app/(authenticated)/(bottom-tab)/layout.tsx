import * as React from "react";
import BottomTabMenu from "./_layout/BottomTabMenu";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Header from "./_layout/Header";

const BOTTOM_TAB_MENU_HEIGHT = 56;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header />
      <Toolbar />

      <Box
        sx={{
          flex: 1,
          pb: `${BOTTOM_TAB_MENU_HEIGHT}px`,
        }}
      >
        {children}
      </Box>

      <BottomTabMenu
        sx={{
          height: `${BOTTOM_TAB_MENU_HEIGHT}px`,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
    </Box>
  );
}
