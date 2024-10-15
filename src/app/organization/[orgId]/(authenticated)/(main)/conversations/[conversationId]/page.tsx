"use client";

import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import ConversationPart from "@/components/modules/conversation/ConversationPart";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import {
  useConversationParts,
  createConversationParts,
} from "@/modules/api/client";
import { OrganizationsCol } from "@/modules/api/types";
import { useUser } from "@/app/_layout/UserProvider";
import GoogleGenAI from "@/modules/google-generative-ai";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "./_page/Header";

interface PageProps {
  params: {
    orgId: string;
    conversationId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { user } = useUser();

  const partsListRef = React.useRef<HTMLDivElement>(null);

  function scrollToBottomOfPartsList() {
    partsListRef.current?.scrollTo(0, partsListRef.current?.scrollHeight + 50);
  }

  // TODO: handle loading and error states
  const [data = [], isLoading, error] = useConversationParts({
    orgId: params.orgId,
    conversationId: params.conversationId,
  });
  const [temporaryData, setTemporaryData] = React.useState<
    OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[]
  >([]);

  const [sendLoadingStatus, setSendLoadingStatus] = React.useState<
    "idle" | "sending_user_message" | "loading_ai_response"
  >("idle");
  const [sendError, setSendError] = React.useState<string | null>(null);

  React.useEffect(
    function scrollWhenLoadingAiResponse() {
      if (sendLoadingStatus === "loading_ai_response") {
        scrollToBottomOfPartsList();
      }
    },
    [sendLoadingStatus]
  );

  async function onSend(message: string) {
    if (sendLoadingStatus !== "idle") {
      return;
    }

    setSendError(null);

    try {
      setSendLoadingStatus("sending_user_message");
      setTemporaryData(data);

      const userPart: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc = {
        id: "user-temporary",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        notifiedAt: Date.now(),
        author: {
          id: user.uid,
          type: "user",
          name: user.displayName || "Anônimo",
          photoURL: user.photoURL || "",
        },
        replyOptions: [],
        type: "comment",
        body: message,
      };
      setTemporaryData((prev) => [...prev, userPart]);

      setSendLoadingStatus("loading_ai_response");
      const model = GoogleGenAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      const chat = model.startChat({
        history: temporaryData
          .filter((p) => Boolean(p.body))
          .map((p) => ({
            role: authorTypeToGoogleGenAIRole(p.author.type),
            parts: [{ text: p.body || "" }],
          })),
      });

      let aiPart: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc = {
        id: "ai-temporary",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        notifiedAt: Date.now(),
        author: {
          id: `gemini-1.5-flash`,
          name: "AI",
          type: "bot",
          photoURL: "",
        },
        replyOptions: [],
        type: "comment",
        body: "",
      };
      setTemporaryData((prev) => [...prev, aiPart]);

      const result = await chat.sendMessageStream(message);
      for await (const chunk of result.stream) {
        aiPart = {
          ...aiPart,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          notifiedAt: Date.now(),
          body: (aiPart.body || "") + chunk.text(),
        };
        setTemporaryData((prev) => [...prev.slice(0, prev.length - 1), aiPart]);
      }

      await createConversationParts(params.orgId, params.conversationId, [
        userPart,
        aiPart,
      ]);
    } catch (error: any) {
      setSendError(error?.message || "Erro ao enviar mensagem");
    } finally {
      setTemporaryData([]);
      setSendLoadingStatus("idle");
    }
  }

  function onReply(
    replyOption: OrganizationsCol.ConversationsSubCol.PartsSubCol.ConversationPartReplyOption
  ) {
    onSend(replyOption.text);
  }

  const dataToUse = (
    sendLoadingStatus === "loading_ai_response" ? temporaryData : data
  ).toReversed(); // Because we are using column-reverse

  return (
    <Box
      sx={{
        height: 400,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Header conversationId={params.conversationId} orgId={params.orgId} />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          marginBottom: "70px",
          display: "flex",

          // Make sure the scroll always starts at the bottom
          flexDirection: "column-reverse",
        }}
        ref={partsListRef}
      >
        {dataToUse.map((p) => (
          <ConversationPart
            key={p.id}
            part={p}
            part_type={p.type}
            onReply={onReply}
          />
        ))}

        <Box sx={{ flexGrow: 1 }} />

        {sendError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Erro</AlertTitle>
            {sendError}
          </Alert>
        )}

        <SendMessage
          onSend={onSend}
          isLoading={sendLoadingStatus !== "idle"}
          sx={{
            px: 1,
            height: "70px",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      </Box>
    </Box>
  );
}

function SendMessage({
  onSend,
  isLoading,
  sx,
}: {
  onSend: (message: string) => void;
  isLoading: boolean;
  sx?: BoxProps["sx"];
}) {
  const [message, setMessage] = React.useState("");
  const disableSend = isLoading || message.trim().length === 0;

  function _onSend() {
    if (!disableSend) {
      onSend(message);
      setMessage("");
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        ...sx,
      }}
    >
      <FormControl sx={{ m: 1, width: "100%" }} variant="filled">
        <FilledInput
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              _onSend();
            }
          }}
          multiline
          placeholder="Escrever mensagem"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                disabled={disableSend}
                onClick={_onSend}
                sx={{
                  bgcolor: "background.paper",
                  mx: 0.5,
                  mb: 2.5, // For some reason, when multiline we need this to centralize the icon
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
}

type GoogleGenAIRole = "user" | "model" | "function" | "system";

function authorTypeToGoogleGenAIRole(
  type: OrganizationsCol.ConversationsSubCol.PartsSubCol.ConversationPartAuthor["type"]
): GoogleGenAIRole {
  switch (type) {
    case "user":
      return "user";
    case "bot":
      return "model";
    default:
      return "system";
  }
}
