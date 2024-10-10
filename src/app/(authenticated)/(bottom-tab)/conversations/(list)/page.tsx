"use client";

import Box from "@mui/material/Box";
import ConversationsList from "@/components/modules/conversation/ConversationsList";
import Button from "@mui/material/Button";
import SendMessageIcon from "@mui/icons-material/Send";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "@/components/elements/Logo";
import Link from "next/link";
import { useUserConversations } from "@/modules/api/client";
import { useUser } from "@/app/_layout/UserProvider";

export default function Page() {
  const { user } = useUser();
  const [data = [], isLoading, error] = useUserConversations(user.uid);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        position: "relative",
        paddingBottom: `${70}px`,
      }}
    >
      <ConversationsList data={data} />

      <Box sx={{ flexGrow: 1 }} />

      <Button
        LinkComponent={Link}
        href="/conversations/list/create"
        variant="contained"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          maxWidth: 400,
          mb: 3,
          position: "fixed",
          bottom: 120,
        }}
      >
        Envie uma mensagem
        <SendMessageIcon />
      </Button>
    </Box>
  );
}
