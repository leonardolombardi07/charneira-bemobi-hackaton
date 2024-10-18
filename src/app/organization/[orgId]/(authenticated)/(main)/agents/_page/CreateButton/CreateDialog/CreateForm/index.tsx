"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createAgent } from "@/modules/api/client";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Container from "@mui/material/Container";
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

    const instructions = String(formData.get("instructions"));
    if (!instructions) return setError(`As instruções não podem estar vazias.`);

    setIsLoading(true);
    setError(null);

    try {
      createAgent({
        name,
        description,
        orgId: params.orgId as string,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        instructions,
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
            placeholder={`Descreva o agente, suas funções, responsabilidades, etc...`}
            multiline
            rows={4}
            sx={{
              my: 1,
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            name="instructions"
            fullWidth
            label={`Instruções`}
            placeholder="Customize como seu agente deve se comportar. Aqui você pode adicionar instruções para o agente, como por exemplo, como ele deve responder a determinadas perguntas, como ele deve se comportar em determinadas situações, etc..."
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
