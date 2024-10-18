import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface Tier {
  title: string;
  subheader?: string;
  price: string;
  description: string[];
  buttonText: string | null;
  buttonVariant: "outlined" | "contained";
  buttonColor: "primary" | "secondary";
}

const TIERS: Tier[] = [
  {
    title: "Gratuito",
    price: "0",
    description: [
      "1 agente incluso",
      "10 clientes",
      "1000 conversas por mês",
      "Suporte por email",
    ],
    buttonText: null,
    buttonVariant: "outlined",
    buttonColor: "primary",
  },
  {
    title: "Profissional",
    subheader: "Recomendado",
    price: "15",
    description: [
      "5 agentes inclusos",
      "50 clientes",
      "Conversas ilimitadas",
      "Suporte por email e telefone",
      "Time de suporte dedicado",
      "Múltiplos canais de atendimento",
      "Pagamento integrado ao Chat",
    ],
    buttonText: "Contratar Agora",
    buttonVariant: "contained",
    buttonColor: "secondary",
  },
  {
    title: "Corporativo",
    price: "30",
    description: [
      "10 agentes inclusos",
      "100 clientes",
      "Conversas ilimitadas",
      "Suporte por email e telefone",
    ],
    buttonText: "Contatar Vendas",
    buttonVariant: "outlined",
    buttonColor: "primary",
  },
];

interface PlansProps {
  closeDialog: () => void;
}

export default function Plans({ closeDialog }: PlansProps) {
  return (
    <Container
      id="Plans"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Alert severity="info">
        <AlertTitle>Oooops!</AlertTitle>
        Você atingiu o limite de agentes do plano atual. Para adicionar mais
        agentes, você precisa fazer um upgrade de plano.
      </Alert>

      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        <Typography
          component="h2"
          variant="h2"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          Planos de Assinatura
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Escolha um plano que se encaixe melhor nas necessidades da sua
          empresa.
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}
      >
        {TIERS.map((tier) => (
          // @ts-ignore
          <Grid
            size={{ xs: 12, sm: tier.title === "Enterprise" ? 12 : 6, md: 4 }}
            key={tier.title}
          >
            <Card
              sx={[
                {
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                },
                tier.title === "Professional" &&
                  ((theme) => ({
                    border: "none",
                    background:
                      "radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))",
                    boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
                    // @ts-ignore
                    ...theme.applyStyles("dark", {
                      background:
                        "radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))",
                      boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`,
                    }),
                  })),
              ]}
            >
              <CardContent>
                <Box
                  sx={[
                    {
                      mb: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    },
                    tier.title === "Professional"
                      ? { color: "grey.100" }
                      : { color: "" },
                  ]}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === "Professional" && (
                    <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
                  )}
                </Box>
                <Box
                  sx={[
                    {
                      display: "flex",
                      alignItems: "baseline",
                    },
                    tier.title === "Professional"
                      ? { color: "grey.50" }
                      : { color: null },
                  ]}
                >
                  <Typography component="h3" variant="h2">
                    ${tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; per month
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={[
                        {
                          width: 20,
                        },
                        tier.title === "Professional"
                          ? { color: "primary.light" }
                          : { color: "primary.main" },
                      ]}
                    />
                    <Typography
                      variant="subtitle2"
                      component={"span"}
                      sx={[
                        tier.title === "Professional"
                          ? { color: "grey.50" }
                          : { color: null },
                      ]}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                {tier.buttonText && (
                  <Button
                    fullWidth
                    variant={tier.buttonVariant as "outlined" | "contained"}
                    color={tier.buttonColor as "primary" | "secondary"}
                    onClick={closeDialog}
                  >
                    {tier.buttonText}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
