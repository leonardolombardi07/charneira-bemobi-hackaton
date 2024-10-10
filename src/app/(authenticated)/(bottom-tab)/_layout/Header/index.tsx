"use client";

import React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "@/components/elements/Logo";
import { APP_NAME } from "@/app/constants";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export const HEADER_HEIGHT = 64;

interface HeaderProps {
  sx: AppBarProps["sx"];
}

export default function Header() {
  return (
    <AppBar
      component="nav"
      position="fixed"
      sx={{
        height: HEADER_HEIGHT,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          py: 0.5,
        }}
      >
        <Box
          component={Link}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Logo size="small" />
          <Typography
            variant="h6"
            component="h2"
            color={(t) => {
              const isDark = t.palette.mode === "dark";
              return isDark ? "secondary.main" : "inherit";
            }}
            sx={{
              ml: "3px",
            }}
          >
            {APP_NAME}™
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
