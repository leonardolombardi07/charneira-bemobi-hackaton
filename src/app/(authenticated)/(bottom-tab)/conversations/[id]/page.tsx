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
  updateConversation,
  useConversation,
} from "@/modules/api/client";
import { ConversationsCol } from "@/modules/api/types";
import { useUser } from "@/app/_layout/UserProvider";
import GoogleGenAI, { Content } from "@/modules/google-generative-ai";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "./_page/Header";
import { HEADER_HEIGHT } from "../../_layout/Header";
import { BOTTOM_TAB_MENU_HEIGHT } from "../../layout";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const conversationId = params.id;
  const { user } = useUser();

  const partsListRef = React.useRef<HTMLDivElement>(null);

  function scrollToBottomOfPartsList() {
    partsListRef.current?.scrollTo(0, partsListRef.current?.scrollHeight + 50);
  }

  // TODO: handle loading and error states
  const [data = [], isLoading, error] = useConversationParts(conversationId);
  const [conversation, isLoadingConversation, conversationError] =
    useConversation(conversationId);

  const [temporaryData, setTemporaryData] = React.useState<
    ConversationsCol.PartsSubCol.Doc[]
  >([]);

  const [sendLoadingStatus, setSendLoadingStatus] = React.useState<
    "idle" | "sending_user_message" | "loading_ai_response" | "loading_ai_title"
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

    // This is bad code. We can't access temporaryData state inside this function as it is not updated yet. So we create a temporary variable to store the data.
    let tempData: ConversationsCol.PartsSubCol.Doc[] = data;

    try {
      setSendLoadingStatus("sending_user_message");
      setTemporaryData(tempData);

      const userPart: ConversationsCol.PartsSubCol.Doc = {
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

      tempData = [...tempData, userPart];
      setTemporaryData(tempData);

      setSendLoadingStatus("loading_ai_response");
      const model = GoogleGenAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      const chat = model.startChat({
        history: tempData
          .filter((p) => Boolean(p.body))
          .map((p) => ({
            role: authorTypeToGoogleGenAIRole(p.author.type),
            parts: [{ text: p.body || "" }],
          })),
      });

      let aiPart: ConversationsCol.PartsSubCol.Doc = {
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
      tempData = [...tempData, aiPart];
      setTemporaryData(tempData);

      const result = await chat.sendMessageStream(message);
      for await (const chunk of result.stream) {
        aiPart = {
          ...aiPart,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          notifiedAt: Date.now(),
          body: (aiPart.body || "") + chunk.text(),
        };
        tempData = [...tempData.slice(0, tempData.length - 1), aiPart];
        setTemporaryData(tempData);
      }

      await createConversationParts(conversationId, [userPart, aiPart]);

      if (conversation?.title) {
        // No need to await this
        updateConversation(conversationId, { lastPart: aiPart });
        return;
      }

      setSendLoadingStatus("loading_ai_title");
      const askForTitlePrompt = `Based on the parts before this conversation, ANSWER with ONE good title with maximum of 10 words. But really try to give a title - like, if its a vague or strange conversation, try to give a title that captures that. Don't answer with things like "Please provide me more context"`;
      const updatedChat = model.startChat({
        history: [
          ...tempData
            .filter((p) => Boolean(p.body))
            .map((p) => ({
              role: authorTypeToGoogleGenAIRole(p.author.type),
              parts: [{ text: p.body || "" }],
            })),
          { role: "model", parts: [{ text: askForTitlePrompt }] },
        ],
      });
      const titleResult = await updatedChat.sendMessage("");
      const title = titleResult.response.text();
      const parsedTitle = title.trim() === "No title" ? "" : title;
      updateConversation(conversationId, {
        title: parsedTitle,
        lastPart: aiPart,
      });
    } catch (error: any) {
      setSendError(error?.message || "Erro ao enviar mensagem");
    } finally {
      setTemporaryData([]);
      setSendLoadingStatus("idle");
    }
  }

  function onReply(
    replyOption: ConversationsCol.PartsSubCol.ConversationPartReplyOption
  ) {
    onSend(replyOption.text);
  }

  const dataToUse = (
    sendLoadingStatus === "loading_ai_response" ? temporaryData : data
  ).toReversed(); // Because we are using column-reverse

  return (
    <Box
      sx={{
        height: `calc(100vh - ${HEADER_HEIGHT}px - ${BOTTOM_TAB_MENU_HEIGHT}px)`,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Header
        conversation={conversation}
        isLoading={isLoadingConversation}
        error={conversationError}
      />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
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
      </Box>

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
          px: {
            xs: 0,
            sm: 1,
          },
        }}
      />
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
      <FormControl
        sx={{
          mx: {
            xs: 2,
            sm: 4,
          },
          my: {
            xs: 1,
            sm: 2,
          },
          width: "100%",
        }}
        variant="filled"
      >
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

type GoogleGenAIRole = "user" | "model";

function authorTypeToGoogleGenAIRole(
  type: ConversationsCol.PartsSubCol.ConversationPartAuthor["type"]
): GoogleGenAIRole {
  switch (type) {
    case "user":
      return "user";
    case "bot":
      return "model";
    default:
      if (process.env.NODE_ENV === "development") {
        throw new Error(`Invalid author type: ${type}`);
      }

      return "model";
  }
}
