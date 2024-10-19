"use client";

import React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { OrganizationsCol } from "@/modules/api";

interface HeaderProps {
  conversation: OrganizationsCol.ConversationsSubCol.Doc;
  sx?: AppBarProps["sx"];
}

const HEADER_HEIGHT = 64;

export default function Header({ conversation, sx }: HeaderProps) {
  return (
    <AppBar
      component={Box}
      color="secondary"
      sx={{
        height: HEADER_HEIGHT,
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
        <Typography variant="body1">{conversation.title}</Typography>
      </Toolbar>
    </AppBar>
  );
}
