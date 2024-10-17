"use client";

import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import ConversationPart, {
  ConversationPart as IConversationPart,
  CommentConversationPart,
  ReplyOption,
} from "@/components/modules/conversation/ConversationPart";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

export default function Page() {
  const [parts, setParts] = React.useState<IConversationPart[]>([]);

  function onSend(message: string) {
    setParts([
      ...parts,
      {
        ...createCommonPart(),
        part_type: "comment",
        body: message,
      } as CommentConversationPart,
    ]);
  }

  function onReply(replyOption: ReplyOption) {
    onSend(replyOption.text);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "hidden",
      }}
    >
      <Header sx={{}} />

      <ConversationPartsList
        parts={[]}
        onReply={onReply}
        sx={{
          flex: "1 1 0%",
          overflow: "hidden",
          position: "relative",
        }}
      />

      <SendMessage onSend={onSend} sx={{}} />
    </Box>
  );
}

export const HEADER_HEIGHT = 64;

function Header({ sx }: { sx?: BoxProps["sx"] }) {
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
      ></Toolbar>
    </AppBar>
  );
}

function ConversationPartsList({
  parts,
  onReply,
  sx,
}: {
  parts: IConversationPart[];
  onReply: (replyOption: ReplyOption) => void;
  sx?: BoxProps["sx"];
}) {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      {parts.map((p) => (
        // @ts-ignore
        <ConversationPart
          key={p.id}
          part={p}
          part_type={p.part_type}
          onReply={onReply}
        />
      ))}
    </Box>
  );
}

function SendMessage({
  onSend,
  sx,
}: {
  onSend: (message: string) => void;
  sx?: BoxProps["sx"];
}) {
  const [message, setMessage] = React.useState("");
  const disableSend = message.trim().length === 0;
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        mt: 2,
        ...sx,
      }}
    >
      <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
        <InputLabel>Escrever mensagem</InputLabel>
        <FilledInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                disabled={disableSend}
                onClick={() => onSend(message)}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
}

function createCommonPart() {
  return {
    id: String(Date.now()),
    type: "conversation_part",
    author: {
      id: "1",
      type: "user",
      name: "Leonardo",
      isSelf: true,
    },
    created_at: Date.now(),
    updated_at: Date.now(),
    notified_at: Date.now(),
  };
}
