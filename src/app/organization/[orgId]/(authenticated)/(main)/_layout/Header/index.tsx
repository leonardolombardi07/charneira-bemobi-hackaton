"use client";

import React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "@/components/elements/Logo";
import { APP_NAME } from "@/app/organization/constants";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { DRAWER_WIDTH } from "../constants";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export const HEADER_HEIGHT = 64;

interface HeaderProps {
  sx?: AppBarProps["sx"];
  onDrawerToggle: () => void;
}

export default function Header({ sx, onDrawerToggle }: HeaderProps) {
  return (
    <AppBar
      component="nav"
      position="fixed"
      sx={{
        height: HEADER_HEIGHT,
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
        ...sx,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          py: 0.5,
        }}
      >
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

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
