"use client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SendMessageIcon from "@mui/icons-material/Send";
import Link from "next/link";
import { lighten, Theme } from "@mui/material/styles";

export default function Page() {
  function getMainBackgroundColor(t: Theme) {
    const isDark = t.palette.mode === "dark";
    if (isDark) {
      return lighten(t.palette.background.paper, 0.02);
    }

    const p = t.palette.primary;
    return p.main;
  }

  return (
    <Container
      // maxWidth="sm"
      sx={{
        px: 4,
        pt: 10,
        pb: 6,
        flex: 1,
        background: (t) => {
          const isDark = t.palette.mode === "dark";
          if (isDark) {
            return getMainBackgroundColor(t);
          }

          const s = t.palette.secondary;
          const mainColor = getMainBackgroundColor(t);
          const secondaryColor = s.main;
          return `linear-gradient(to bottom, ${mainColor}, ${secondaryColor})`;
        },
        color: (t) => {
          return t.palette.getContrastText(getMainBackgroundColor(t));
        },
      }}
    >
      <Box
        sx={{
          px: 1,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
          }}
        >
          Olá Leonardo 👋
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Como podemos te ajudar?
        </Typography>
      </Box>

      <RecentMessage />
      <Box sx={{ mt: 3 }} />
      <SendAMessage />
    </Container>
  );
}

function RecentMessage() {
  const FAKE_ID = "1";
  return (
    <Paper
      component={Link}
      href={`/conversations/list/${FAKE_ID}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        textDecoration: "none",
        px: 3,
        py: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          mb: 1,
        }}
      >
        Mensagem recente
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar src="https://randomuser.me/api/port ..." />

        <Box>
          <Typography variant="body1">Classifique sua conversa</Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            Babi • Há 5d
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <ArrowRightIcon
          sx={{
            fontSize: 35,
          }}
        />
      </Box>
    </Paper>
  );
}

function SendAMessage() {
  return (
    <Paper
      component={Link}
      href="/conversations/list/create"
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        textDecoration: "none",
        px: 3,
        py: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
        }}
      >
        Envie uma mensagem
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <SendMessageIcon />
    </Paper>
  );
}
