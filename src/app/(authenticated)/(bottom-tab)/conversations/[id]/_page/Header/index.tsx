"use client";

import React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import GoBackIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/navigation";
import { ConversationsCol } from "@/modules/api";
import { FirebaseError } from "firebase/app";
import { containText } from "@/modules/inlineStyles";

interface HeaderProps {
  conversation: ConversationsCol.Doc | undefined;
  isLoading: boolean;
  error: FirebaseError | undefined;
  sx?: AppBarProps["sx"];
}

const HEADER_HEIGHT = 64;

export default function Header({
  isLoading,
  error,
  conversation,
  sx,
}: HeaderProps) {
  // TODO: handle loading and error states
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
          sx={{ ml: 1 }}
        >
          <GoBackIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            ...containText({ lines: 1 }),
          }}
        >
          {conversation?.title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
