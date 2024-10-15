"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Header from "./_layout/Header";
import Toolbar from "@mui/material/Toolbar";
import { DRAWER_WIDTH } from "./_layout/constants";
import Drawer from "./_layout/Drawer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileDrawingClosing, setIsMobileDrawingClosing] =
    React.useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);

  function toggleDrawer() {
    if (!isMobileDrawingClosing) {
      setIsMobileDrawerOpen(!isMobileDrawerOpen);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Header onDrawerToggle={toggleDrawer} />

      <Drawer
        mobileOpen={isMobileDrawerOpen}
        setIsClosing={setIsMobileDrawingClosing}
        setMobileOpen={setIsMobileDrawerOpen}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
