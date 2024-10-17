"use client";

import React from "react";
import Divider from "@mui/material/Divider";
import GoogleButton from "@/components/elements/GoogleButton";
import Button from "@mui/material/Button";
import Copyright from "../Copyright";
import { useContinueWithProvider } from "./useContinueWithProvider";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import AnonymousIcon from "@mui/icons-material/Person";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function AuthBottom() {
  const { isLoading, error, continueWithProvider } = useContinueWithProvider();

  return (
    <React.Fragment>
      <Divider sx={{ my: 4 }}>OU</Divider>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Erro</AlertTitle>
          {error}
        </Alert>
      )}

      <GoogleButton
        onClick={() => continueWithProvider("google")}
        label="Continuar com Google"
        style={{
          width: "100%",
        }}
      />

      <Button
        onClick={() => continueWithProvider("anonymous")}
        variant="outlined"
        color="primary"
        fullWidth
        startIcon={<AnonymousIcon />}
        sx={{ mt: 2, mb: 2, height: 50 }}
        size="large"
      >
        Entrar Anonimamente
      </Button>

      <Copyright sx={{ mt: 5 }} />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
}
