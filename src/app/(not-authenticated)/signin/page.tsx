"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useSignInWithForm } from "./_page/hooks";
import PasswordTextField from "@/components/inputs/PasswordTextField";
import AuthLink from "../_components/AuthLink";
import AuthBottom from "../_components/AuthBottom";

export default function Page() {
  const {
    refs: { emailRef, passwordRef },
    isLoading,
    submitError: error,
    onSubmit,
  } = useSignInWithForm();

  return (
    <React.Fragment>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>

      <Typography component="h1" variant="h5">
        Entrar
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
          inputRef={emailRef}
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
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
            "Entrar"
          )}
        </Button>

        <Grid container>
          <Grid item xs>
            <AuthLink href="/forgot-password">Esqueceu sua senha?</AuthLink>
          </Grid>

          <Grid item>
            <AuthLink href="/signup">Não tem uma conta? Cadastre-se</AuthLink>
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
