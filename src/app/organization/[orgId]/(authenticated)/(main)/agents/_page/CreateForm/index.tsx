"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createAgent } from "@/modules/api/client";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { useParams } from "next/navigation";
import { useTheme } from "@mui/material";

interface CreateFormProps {
  onCreate: () => void;
  onCancel: () => void;
}

export default function CreateForm({ onCreate, onCancel }: CreateFormProps) {
  const params = useParams();
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFormSubmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name"));
    const minNameLength = 5;
    if (name?.length < minNameLength)
      return setError(`O nome deve ter ao menos ${minNameLength} caracteres.`);

    const description = String(formData.get("description"));

    const prompt = String(formData.get("prompt"));
    if (!prompt) return setError(`O prompt não pode ser vazio.`);

    setIsLoading(true);
    setError(null);

    try {
      await createAgent({
        name,
        description,
        orgId: params.orgId as string,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        prompts: [prompt],
        uiConfig: {
          alignment: "left",
          color: theme.palette.primary.main,
          secondaryColor: theme.palette.secondary.main,
          logoUrl: null,
          verticalPadding: 0,
          horizontalPadding: 0,
        },
      });
      onCreate();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <form onSubmit={onFormSubmission}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            py: 4,
            px: 2,
          }}
        >
          <TextField
            name="name"
            fullWidth
            required
            label={`Nome`}
            placeholder="Nome do agente..."
            sx={{
              my: 1,
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            name="description"
            fullWidth
            label={`Descrição`}
            placeholder="Descrição do agente..."
            multiline
            rows={4}
            sx={{
              my: 1,
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            name="prompt"
            fullWidth
            label={`Prompt`}
            placeholder="Customize como seu agente deve se comportar. Aqui você pode adicionar mensagens de boas-vindas, instruções, dados importantes, etc..."
            multiline
            rows={6}
            sx={{
              my: 1,
            }}
            InputLabelProps={{ shrink: true }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Erro</AlertTitle>
              {error}
            </Alert>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 2,
            pb: 2,
          }}
        >
          <Button
            type="submit"
            size="large"
            variant="contained"
            fullWidth
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Criar Agente"}
          </Button>

          <Button onClick={onCancel} size="large" variant="outlined" fullWidth>
            Cancelar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
