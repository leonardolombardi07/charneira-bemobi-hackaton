"use client";

import React from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import PasswordTextField from "@/components/inputs/PasswordTextField";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import UserOutlinedIcon from "@mui/icons-material/PersonOutline";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleButton from "@/components/elements/GoogleButton";
import { useLinkWithEmailAndPassword } from "./useLinkWithEmailAndPassword";
import { useLinkWithProvider } from "./useLinkWithProvider";
import Backdrop from "@mui/material/Backdrop";
import Divider from "@mui/material/Divider";

interface LinkAnonymousUserFormProps {
  onSuccessfulLink: () => void;
}

export default function LinkAnonymousUserForm({
  onSuccessfulLink,
}: LinkAnonymousUserFormProps) {
  const {
    refs: { emailRef, passwordRef },
    isLoading: isLinkingWithEmailAndPassword,
    submitError: linkWithEmailAndPasswordError,
    linkWithEmailAndPassword,
  } = useLinkWithEmailAndPassword();
  const {
    isLoading: isLinkingWithProvider,
    error: linkWithProviderError,
    linkWithProvider,
  } = useLinkWithProvider();

  async function onLinkWithEmailAndPassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    const { success } = await linkWithEmailAndPassword(event);
    if (success) {
      onSuccessfulLink();
    }
  }

  async function onLinkWithProvider(provider: "google") {
    const { success } = await linkWithProvider(provider);
    if (success) {
      onSuccessfulLink();
    }
  }

  const error = linkWithEmailAndPasswordError || linkWithProviderError;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: {
          xs: 2,
          sm: 4,
        },
      }}
    >
      <Backdrop open={isLinkingWithProvider}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <UserOutlinedIcon />
      </Avatar>

      <Typography component="h1" variant="h5">
        Conectar contar
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Conecte sua conta anônima a uma conta existente para manter suas
        informações. Suas interações como anônimo serão transferidas para a
        conta conectada.
      </Typography>

      <Box
        sx={{
          mt: 2,
          width: "100%",
          px: {
            xs: 0,
            sm: 4,
          },
        }}
      >
        <Box component="form" noValidate onSubmit={onLinkWithEmailAndPassword}>
          <TextField
            inputRef={emailRef}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                passwordRef.current?.focus();
              }
            }}
          />

          <PasswordTextField
            inputRef={passwordRef}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            size="large"
          >
            {isLinkingWithEmailAndPassword ? (
              <CircularProgress
                size={24}
                sx={{
                  color: (t) =>
                    t.palette.getContrastText(t.palette.primary.main),
                }}
              />
            ) : (
              "Conectar com email e senha"
            )}
          </Button>

          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <AlertTitle>Erro</AlertTitle>
                {error}
              </Alert>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }}>OU</Divider>

        <Box>
          <GoogleButton
            onClick={() => onLinkWithProvider("google")}
            label="Conectar com Google"
            style={{
              width: "100%",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
