"use client";

import Box from "@mui/material/Box";
import ConversationsList from "@/components/modules/conversation/ConversationsList";
import Button from "@mui/material/Button";
import SendMessageIcon from "@mui/icons-material/Send";
import React from "react";
import { createConversation, useUserConversations } from "@/modules/api/client";
import { useUser } from "@/app/_layout/UserProvider";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";

const CREATE_BUTTON_PADDING_BOTTOM = 50;

export default function Page() {
  const { user } = useUser();
  const [data = [], isLoading, error] = useUserConversations(user.uid);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        position: "relative",
        paddingBottom: `${CREATE_BUTTON_PADDING_BOTTOM * 2}px`,
        pt: 1,
      }}
    >
      <ConversationsList data={data} isLoading={isLoading} error={error} />

      <Box sx={{ flexGrow: 1 }} />

      <CreateConversationButton />
    </Container>
  );
}

function CreateConversationButton() {
  const { user } = useUser();
  const router = useRouter();

  function onClick() {
    const { id } = createConversation({
      title: "",
      lastPart: null,
      membersIds: [user.uid],
    });
    router.push(`/conversations/${id}`);
  }

  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
        maxWidth: {
          xs: "90%",
          sm: 400,
        },
        mb: 3,
        position: "fixed",
        bottom: CREATE_BUTTON_PADDING_BOTTOM,
      }}
    >
      Iniciar nova conversa
      <SendMessageIcon />
    </Button>
  );
}
