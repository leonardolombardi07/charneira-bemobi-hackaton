"use client";

import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PasswordTextField from "@/components/inputs/PasswordTextField";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { signIn } from "@/modules/api/client";
import Box from "@mui/material/Box";
import { getHumanReadableErrorMessage } from "../utils";

interface SignInFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SignInForm({ onSuccess, onCancel }: SignInFormProps) {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFormSubmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!email) return emailRef.current?.focus();
    if (!password) return passwordRef.current?.focus();

    try {
      setIsLoading(true);
      await signIn("email/password", {
        email,
        password,
      });
      setError(null);
      onSuccess();
    } catch (error: any) {
      setError(getHumanReadableErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box component={"form"} onSubmit={onFormSubmission}>
      <TextField
        autoFocus
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
        required
        id="password"
        name="password"
        label="Senha"
        type="password"
        fullWidth
        sx={{ my: 3 }} // For some reason we need to add margin to the text field
      />

      {error && (
        <Alert severity="error">
          <AlertTitle>Erro</AlertTitle>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button onClick={onCancel} size="medium">
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="medium"
          disabled={isLoading}
          sx={{
            minWidth: 160,
          }}
        >
          {isLoading ? "Carregando" : "Entrar"}
        </Button>
      </Box>
    </Box>
  );
}
