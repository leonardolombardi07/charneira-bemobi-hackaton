"use client";

import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PasswordTextField from "@/components/inputs/PasswordTextField";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { signUp } from "@/modules/api/client";
import Box from "@mui/material/Box";
import { getHumanReadableErrorMessage } from "../../../utils";
import { useUserContext } from "@/app/_layout/UserProvider";

interface SignUpFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SignUpForm({ onSuccess, onCancel }: SignUpFormProps) {
  const { setUser } = useUserContext();

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const aboutMeRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFormSubmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const aboutMe = String(formData.get("aboutMe"));

    if (!name) return nameRef.current?.focus();
    if (!email) return emailRef.current?.focus();
    if (!password) return passwordRef.current?.focus();

    try {
      setIsLoading(true);
      const { user } = await signUp("email/password", {
        name,
        email,
        password,
        aboutMe,
      });
      setUser({
        ...user,
        displayName: name,
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
        inputRef={nameRef}
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nome"
        name="name"
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
        required
        id="password"
        name="password"
        label="Senha"
        type="password"
        fullWidth
        sx={{ my: 3 }} // For some reason we need to add margin to the text field
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            aboutMeRef.current?.focus();
          }
        }}
      />

      <TextField
        inputRef={aboutMeRef}
        name="aboutMe"
        fullWidth
        label={`Sobre mim`}
        placeholder="Descreva um pouco sobre você..."
        multiline
        rows={4}
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
          {isLoading ? "Carregando" : "Cadastrar"}
        </Button>
      </Box>
    </Box>
  );
}
