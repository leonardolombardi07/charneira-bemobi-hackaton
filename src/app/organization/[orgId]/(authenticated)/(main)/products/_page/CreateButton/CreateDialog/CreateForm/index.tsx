"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createProduct } from "@/modules/api/client";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "next/navigation";

interface CreateFormProps {
  onCreate: () => void;
  onCancel: () => void;
}

export default function CreateForm({ onCreate, onCancel }: CreateFormProps) {
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

    const unitAmount = Number(formData.get("unitAmount"));
    if (isNaN(unitAmount))
      return setError("O valor unitário deve ser um número válido.");

    const recurringInterval = String(formData.get("recurringInterval"));
    if (!["month", "year"].includes(recurringInterval))
      return setError("O período de cobrança deve ser mensal ou anual.");

    setIsLoading(true);
    setError(null);

    try {
      await createProduct({
        name,
        category: "",
        description,
        features: [],
        orgId: params.orgId as string,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        prices: [
          {
            type: "recurring",
            recurring: {
              interval: recurringInterval as "month" | "year",
              interval_count: 1,
            },
            currency: "BRL",
            unit_amount: unitAmount,
          },
        ],
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
            placeholder="Nome do produto ou serviço..."
            sx={{
              my: 1,
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            name="description"
            fullWidth
            label={`Descrição`}
            placeholder="Descrição do produto ou serviço..."
            multiline
            rows={4}
            sx={{
              my: 1,
            }}
            InputLabelProps={{ shrink: true }}
          />

          <Divider />

          <Box>
            <TextField
              name="unitAmount"
              fullWidth
              required
              label={`Valor Unitário`}
              placeholder="0.0"
              sx={{
                my: 1,
              }}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="recurringInterval">
                Período de Cobrança
              </InputLabel>

              <Select
                name="recurringInterval"
                labelId="recurringInterval"
                fullWidth
                required
                sx={{
                  my: 1,
                }}
              >
                <MenuItem value="month">Mensal</MenuItem>
                <MenuItem value="year">Anual</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
            {isLoading ? "Carregando..." : "Adicionar Produto"}
          </Button>

          <Button onClick={onCancel} size="large" variant="outlined" fullWidth>
            Cancelar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
