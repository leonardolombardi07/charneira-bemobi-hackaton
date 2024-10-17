"use client";

import React from "react";
import Popper from "@mui/material/Popper";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import ConversationPart from "@/components/modules/conversation/ConversationPart";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { BoxProps } from "@mui/system";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "@/components/elements/Logo";
import { APP_NAME } from "@/app/organization/constants";
import AppBar from "@mui/material/AppBar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChatAppProvider, { ChatAppInput, useChatApp } from "./context";
import AIIcon from "@mui/icons-material/Chat";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function ChatApp(props: ChatAppInput) {
  return (
    <ChatAppProvider {...props}>
      <ChatLauncher />
    </ChatAppProvider>
  );
}

function ChatLauncher() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  function toggleChat(e: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  }

  return (
    <React.Fragment>
      <Fab
        onClick={toggleChat}
        sx={{
          position: "fixed",
          bottom: 56 + 18,
          right: 24,
        }}
        color="primary"
        size="large"
      >
        <AIIcon />
      </Fab>

      {anchorEl && (
        <ConversationPopper
          anchorEl={anchorEl}
          close={() => setAnchorEl(null)}
        />
      )}
    </React.Fragment>
  );
}

interface ConversationPopperProps {
  close: () => void;
  anchorEl: HTMLElement;
}

function ConversationPopper({ anchorEl, close }: ConversationPopperProps) {
  const { parts, initializationError, sendStatus, sendError } = useChatApp();
  const someError = sendError || initializationError;

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));

  const partsListRef = React.useRef<HTMLDivElement>(null);
  function scrollToBottomOfPartsList() {
    partsListRef.current?.scrollTo(0, partsListRef.current?.scrollHeight + 50);
  }

  React.useEffect(
    function scrollWhenLoadingAiResponse() {
      if (sendStatus === "loading_ai_response") {
        scrollToBottomOfPartsList();
      }
    },
    [sendStatus]
  );

  function getOffsetForBreakpoint(): [
    number, // x
    number // y
  ] {
    if (isXs) return [0, 0];
    return [-20, 10];
  }

  return (
    <Popper
      open
      anchorEl={anchorEl}
      transition
      placement="top-end"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: getOffsetForBreakpoint(),
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper
            sx={{
              width: {
                xs: "100vw",
                sm: "400px",
              },
              height: {
                xs: "calc(100vh - 56px)",
                sm: "min(704px, 100% - 104px)",
              },
              maxHeight: "704px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Header
              onClose={close}
              sx={{
                position: "sticky",
                top: 0,
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            />

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
              {someError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <AlertTitle>Erro</AlertTitle>
                  {someError}
                </Alert>
              )}

              {parts.map((p) => (
                <ConversationPart
                  key={p.id}
                  part={p}
                  part_type={p.type}
                  onReply={() => {}}
                />
              ))}

              <Box sx={{ flexGrow: 1 }} />

              <Send />
            </Box>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}

function Header({ onClose, sx }: { onClose: () => void; sx?: BoxProps["sx"] }) {
  return (
    <AppBar
      sx={{
        ...sx,
        pt: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          ...sx,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          size="large"
          onClick={onClose}
          sx={{ mx: 1 }}
        >
          <CloseIcon />
        </IconButton>

        <LogoWithTitle />
      </Box>
    </AppBar>
  );
}

function Send() {
  const { sendStatus, send } = useChatApp();
  const [message, setMessage] = React.useState("");

  const isSending = sendStatus !== "idle";
  const disableSend = message.trim().length === 0 || isSending;

  function _onSend() {
    if (!disableSend) {
      send(message);
      setMessage("");
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        px: 1,
        mb: 1,
        height: "70px",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      component="form"
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
                {isSending ? (
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

interface LogoWithTitleProps {
  sx?: BoxProps["sx"];
}

function LogoWithTitle({ sx }: LogoWithTitleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <Logo size="small" />
      <Typography
        variant="h5"
        component="h2"
        color={(t) => {
          const isDark = t.palette.mode === "dark";
          return isDark ? "secondary.main" : "inherit";
        }}
        sx={{
          ml: "3px",
        }}
      >
        {APP_NAME}
      </Typography>
    </Box>
  );
}
