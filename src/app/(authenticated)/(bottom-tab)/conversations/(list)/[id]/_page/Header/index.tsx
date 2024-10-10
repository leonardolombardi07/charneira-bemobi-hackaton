"use client";

import React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import GoBackIcon from "@mui/icons-material/ArrowBackIos";
import { useConversation } from "@/modules/api/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  conversationId: string;
  sx?: AppBarProps["sx"];
}

const HEADER_HEIGHT = 64;

export default function Header({ conversationId, sx }: HeaderProps) {
  // TODO: handle loading and error states
  const [conversation] = useConversation(conversationId);
  const router = useRouter();
  return (
    <AppBar
      component="nav"
      position="fixed"
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
        <IconButton
          onClick={() => router.back()}
          edge="start"
          color="inherit"
          aria-label="back"
        >
          <GoBackIcon />
        </IconButton>
        <Typography variant="h6">{conversation?.title}</Typography>
      </Toolbar>
    </AppBar>
  );
}
