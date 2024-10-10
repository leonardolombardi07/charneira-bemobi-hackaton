"use client";

import React from "react";
import Button from "@mui/material/Button";
import ChangePasswordIcon from "@mui/icons-material/Lock";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AlertTitle from "@mui/material/AlertTitle";
import { updatePassword } from "@/modules/api/client";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PasswordTextField from "@/components/inputs/PasswordTextField";
import { useUser } from "@/app/_layout/UserProvider";

export default function RequestChangePasswordButton() {
  const { user } = useUser();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fullScreen = useFullScreen();

  function closeDialog() {
    setIsDialogOpen(false);
  }

  async function onFormSubmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const newPassword = String(formData.get("newPassword"));
      if (!newPassword) return setError("Senha é obrigatória");
      await updatePassword(newPassword);
      setIsDialogOpen(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <React.Fragment>
      <Button
        onClick={() => {
          setIsDialogOpen(true);
        }}
        size="small"
        startIcon={<ChangePasswordIcon />}
        disabled={user.isAnonymous}
      >
        Mudar senha
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
        <DialogTitle>Mudar sua senha</DialogTitle>
        <DialogContent>
          <PasswordTextField
            autoFocus
            required
            id="newPassword"
            name="newPassword"
            label="Nova senha"
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
            {isLoading ? "Carregando..." : "Mudar senha"}
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
