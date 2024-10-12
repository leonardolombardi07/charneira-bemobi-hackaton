import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ProductsCol } from "@/modules/api";
import Button from "@mui/material/Button";
import { PRODUCTS } from "./data";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import AIIcon from "@mui/icons-material/Chat";
import React from "react";
import { BOTTOM_TAB_MENU_HEIGHT } from "../_layout/constants";
import ConversationFab from "@/components/modules/conversation/ConversationFab";
import N8NChat from "@/components/modules/conversation/N8N";

export default function Page() {
  return (
    <Container
      sx={{
        py: 5,
      }}
    >
      <Box
        sx={{
          maxWidth: {
            md: "100%",
            lg: 800,
          },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: "500",
              fontSize: 35,
            }}
          >
            Planos Vivo para celular com as melhores ofertas
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: 16,
            }}
          >
            Planos Vivo com pacotes de internet e muitos benefícios. Escolha o
            que mais combina com você e navegue em ultravelocidade.
          </Typography>
        </Box>

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "#333", // ALMOST black but not black
          }}
        >
          <Tabs
            value="controle"
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            // TODO: make tab label not uppercased
          >
            <Tab value="controle" label="Controle" />
            <Tab value="pos" label="Pós" />
            <Tab value="familia" label="Família" />
            <Tab value="easy" label="Easy" />
            <Tab value="recarg" label="Recarga" />
          </Tabs>
        </Box>
      </Box>

      <Grid
        container
        rowSpacing={6}
        columnSpacing={8}
        sx={{
          pt: 6,
          pb: 2,
        }}
      >
        {PRODUCTS.map((product, index) => (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
            <ProductCard index={index} product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function ProductCard({
  product,
  index,
}: {
  index: number;
  product: ProductsCol.Doc;
}) {
  const { name, features, prices } = product;

  // Name might be "Vivo Controle 8GB" - remove 8GB part
  const nameWithoutData = name.replace(/\s+\d+GB$/, "");

  //   Get the GB

  const firstFeature = features[0];

  const secondFeature = features[1];
  const restFeatures = features.slice(2);

  const price = prices[0];
  const { currency, unit_amount, recurring } = price;

  const formattedPrice = `R$ ${unit_amount} /${humanReadableRecurring(
    recurring
  )}`;
  return (
    <React.Fragment>
      <Box
        sx={{
          borderColor: "primary.main",
          borderWidth: 1,
          borderStyle: "solid",
          position: "relative",
          width: {
            xs: "100%",
            sm: "100%",
            lg: 280,
          },
          borderRadius: 1,
          height: 360,
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            position: "absolute",
            top: -18,
            left: -2,
            textTransform: "uppercase",
            px: 2,
            py: 1,
            fontSize: 12,
            borderRadius: 1,
          }}
        >
          Sem Fidelidade
        </Box>

        <Box sx={{ px: 2.5, pt: 3.5, pb: 2 }}>
          <Typography
            sx={{
              color: "text.secondary",
              textTransform: "uppercase",
            }}
          >
            {nameWithoutData}
          </Typography>

          <Typography variant="h5" component={"p"} gutterBottom>
            {mapIndexToGB(index)}GB
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
            }}
            gutterBottom
          >
            {secondFeature}
          </Typography>

          <Box
            sx={{
              height: "100%",
              overflow: "auto",
            }}
          >
            {restFeatures.map((feature) => (
              <Typography
                key={feature}
                sx={{
                  color: "primary.main",
                  fontSize: 16,
                }}
                variant="body2"
              >
                + {feature}
              </Typography>
            ))}
          </Box>

          <Box sx={{ flex: 1 }} />

          <Box
            sx={{
              // Fixed at some position at bottom
              position: "absolute",
              bottom: 15,
              // left: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "text.secondary",
              }}
            >
              {formattedPrice}
            </Typography>

            <Button variant="contained" color="secondary">
              Contratar
            </Button>
          </Box>
        </Box>
      </Box>

      {/* <ConversationFab
        variant="extended"
        color="primary"
        sx={{
          position: "fixed",
          bottom: BOTTOM_TAB_MENU_HEIGHT + 18,
          right: 18,
          textTransform: "none",
          textAlign: "left",
          pl: 5,
          pr: 3,
          py: 4,
          fontSize: 16,
        }}
      >
        Olá! Eu sou o OmniChat. Posso te ajudar?
        <AIIcon sx={{ ml: 2 }} />
      </ConversationFab> */}

      <N8NChat />
    </React.Fragment>
  );
}

function humanReadableRecurring(recurring: ProductsCol.Price["recurring"]) {
  if (!recurring) return "";

  const { interval, interval_count } = recurring;

  if (interval !== "month" && process.env.NODE_ENV === "development") {
    throw new Error(`Unexpected interval: ${interval}`);
  }

  if (interval_count === 1) return `mês`;
  return `${interval_count}x por ${interval}`;
}

function mapIndexToGB(index: number) {
  // 14, 26, 26, 26, 26
  if (index === 0) return 14;
  return 26;
}
