"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { updateAgent } from "@/modules/api/client";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Container from "@mui/material/Container";
import { useParams } from "next/navigation";
import { OrganizationsCol } from "@/modules/api";

interface EditFormProps {
  previous: OrganizationsCol.AgentsSubCol.Doc;
  onEdit: () => void;
  onCancel: () => void;
}

export default function EditForm({
  previous,
  onEdit,
  onCancel,
}: EditFormProps) {
  const params = useParams();

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
      updateAgent(previous.id, {
        name,
        description,
        orgId: params.orgId as string,
        updatedAt: Date.now(),
        instructions,
      });
      onEdit();
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
            defaultValue={previous.name}
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
            defaultValue={previous.description}
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
            defaultValue={previous.instructions}
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
            {isLoading ? "Carregando..." : "Atualizar Agente"}
          </Button>

          <Button onClick={onCancel} size="large" variant="outlined" fullWidth>
            Cancelar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
