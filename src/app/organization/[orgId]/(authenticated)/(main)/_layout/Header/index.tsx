"use client";

import React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DRAWER_WIDTH } from "../constants";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useOrganizationById } from "@/modules/api/client";
import { useParams } from "next/navigation";

export const HEADER_HEIGHT = 64;

interface HeaderProps {
  sx?: AppBarProps["sx"];
  onDrawerToggle: () => void;
}

export default function Header({ sx, onDrawerToggle }: HeaderProps) {
  const params = useParams();
  const orgId = params.orgId as string;

  // TODO: handle loading and error states
  const [organization, isLoading, error] = useOrganizationById(orgId);

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
          sx={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              ml: "5px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {organization?.name}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
