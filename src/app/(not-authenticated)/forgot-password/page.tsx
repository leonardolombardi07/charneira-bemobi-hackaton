"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Typography from "@mui/material/Typography";
import { sendPasswordResetEmail } from "@/modules/api/client";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Copyright from "../_components/Copyright";
import AuthLink from "../_components/AuthLink";

function useForm() {
  const emailRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>("");
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    if (!email) return emailRef.current?.focus();

    setIsLoading(true);
    setSubmitError(null);
    setShowSuccessMessage(false);
    try {
      await sendPasswordResetEmail(email);
      setShowSuccessMessage(true);
    } catch (error: any) {
      emailRef.current?.focus();

      if (error.code === "auth/invalid-email") {
        setSubmitError("Invalid email");
      } else {
        setSubmitError("Algo deu errado. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    refs: {
      emailRef,
    },
    isLoading,
    submitError,
    showSuccessMessage,
    onSubmit,
  };
}

const SUBMIT_BUTTON_TEXT = "Enviar e-mail";

export default function Page() {
  const {
    refs: { emailRef },
    isLoading,
    submitError,
    showSuccessMessage,
    onSubmit,
  } = useForm();

  return (
    <React.Fragment>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <UserOutlinedIcon />
      </Avatar>

      <Typography component="h1" variant="h5">
        Esqueceu sua senha?
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
        <Alert
          severity="info"
          sx={{
            width: "100%",
            mt: 2,
          }}
        >
          <AlertTitle>Resete sua senha</AlertTitle>
          Para resetar sua senha, insira seu email abaixo e clique em{" "}
          <strong>{`"${SUBMIT_BUTTON_TEXT}"`}.</strong> Você receberá um email
          com instruções para resetar sua senha.
        </Alert>

        <TextField
          inputRef={emailRef}
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
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
            SUBMIT_BUTTON_TEXT
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
            <AuthLink href="/signin">Voltar para o login</AuthLink>
          </Grid>

          {showSuccessMessage && (
            <Alert
              severity="success"
              sx={{
                width: "100%",
                mt: 2,
              }}
            >
              <AlertTitle>Success</AlertTitle>
              An email has been sent to you with instructions to reset your
              password.
            </Alert>
          )}

          {submitError && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mt: 2,
              }}
            >
              <AlertTitle>Erro</AlertTitle>
              {submitError}
            </Alert>
          )}
        </Grid>

        <Copyright sx={{ mt: 5 }} />
      </Box>
    </React.Fragment>
  );
}
