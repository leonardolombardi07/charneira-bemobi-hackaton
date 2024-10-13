import * as React from "react";
import BottomTabMenu from "./_layout/BottomTabMenu";
import Box from "@mui/material/Box";
import Header from "./_layout/Header";
import { BOTTOM_TAB_MENU_HEIGHT } from "./_layout/constants";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100vh - ${BOTTOM_TAB_MENU_HEIGHT + 4}px)`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Header />

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
