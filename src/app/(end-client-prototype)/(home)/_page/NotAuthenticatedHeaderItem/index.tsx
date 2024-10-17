"use client";

import React from "react";
import Button from "@mui/material/Button";
import AccountIcon from "@mui/icons-material/AccountCircle";
import useDialog from "@/modules/hooks/useDialog";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import PasswordTextField from "@/components/inputs/PasswordTextField";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { signIn } from "@/modules/api/client";

export default function NotAuthenticatedHeaderItem() {
  const {
    isOpen: isDialogOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialog();

  const fullScreen = useFullScreen();

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFormSubmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("newPassword"));

    if (!email) return emailRef.current?.focus();
    if (!password) return passwordRef.current?.focus();

    try {
      setIsLoading(true);
      await signIn("email/password", {
        email,
        password,
      });
      setError(null);
      closeDialog();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <React.Fragment>
      <Button
        variant="text"
        startIcon={<AccountIcon />}
        sx={{
          color: "text.secondary",
        }}
        onClick={openDialog}
      >
        Login
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        PaperProps={{
          component: "form",
          onSubmit: onFormSubmission,
          sx: {
            minWidth: {
              sm: 600,
            },
          },
        }}
        fullScreen={fullScreen}
      >
        <DialogTitle>Entrar</DialogTitle>

        <DialogContent>
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
            id="newPassword"
            name="newPassword"
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
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>

          <Button type="submit" color="primary" disabled={isLoading}>
            {isLoading ? "Carregando" : "Entrar"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function useFullScreen() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}
