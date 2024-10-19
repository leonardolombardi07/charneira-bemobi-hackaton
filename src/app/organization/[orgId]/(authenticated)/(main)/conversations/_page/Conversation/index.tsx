"use client";

import React from "react";
import Box from "@mui/material/Box";
import ConversationPart from "@/components/modules/conversation/ConversationPart";
import { useConversationParts } from "@/modules/api/client";
import { OrganizationsCol } from "@/modules/api/types";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Header from ".//Header";
import Typography from "@mui/material/Typography";

interface ConversationProps {
  selectedConversation: OrganizationsCol.ConversationsSubCol.Doc | null;
}

export default function Conversation({
  selectedConversation,
}: ConversationProps) {
  if (!selectedConversation) {
    return <NotSelected />;
  }

  return <Selected conversation={selectedConversation} />;
}

function Selected({
  conversation,
}: {
  conversation: OrganizationsCol.ConversationsSubCol.Doc;
}) {
  const [parts = [], isLoading, error] = useConversationParts({
    conversationId: conversation.id,
    orgId: conversation.orgId,
  });

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "auto",
      }}
    >
      <Header
        conversation={conversation}
        sx={{
          position: "relative",
        }}
      />

      <Box
        sx={{
          flex: 1,
          py: 4,
          px: 2,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {parts.map((p) => (
          <ConversationPart
            key={p.id}
            part={p}
            part_type={p.type}
            onReply={() => {}}
          />
        ))}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Erro</AlertTitle>
            {error.message}
          </Alert>
        )}
      </Box>
    </Box>
  );
}

function NotSelected() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography variant="h6" color="textSecondary">
        Selecione uma conversa
      </Typography>
    </Box>
  );
}
