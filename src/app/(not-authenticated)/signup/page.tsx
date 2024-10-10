"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useSignUpWithForm } from "./_page/hooks";
import PasswordTextField from "@/components/inputs/PasswordTextField";
import AuthLink from "../_components/AuthLink";
import AuthBottom from "../_components/AuthBottom";

export default function Page() {
  const {
    refs: { nameRef, emailRef, passwordRef },
    isLoading,
    submitError: error,
    onSubmit,
  } = useSignUpWithForm();

  return (
    <React.Fragment>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <UserOutlinedIcon />
      </Avatar>

      <Typography component="h1" variant="h5">
        Criar conta
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={onSubmit}
        sx={{
          mt: 1,
          width: "100%",
          px: {
            xs: 2,
            sm: 5,
          },
        }}
      >
        <TextField
          inputRef={nameRef}
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nome"
          name="name"
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              emailRef.current?.focus();
            }
          }}
        />

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
          {isLoading ? (
            <CircularProgress
              size={24}
              sx={{
                color: (t) => t.palette.getContrastText(t.palette.primary.main),
              }}
            />
          ) : (
            "Criar conta"
          )}
        </Button>

        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid item>
            <AuthLink href="/signin">Já tem uma conta? Entrar</AuthLink>
          </Grid>

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

        <AuthBottom />
      </Box>
    </React.Fragment>
  );
}
