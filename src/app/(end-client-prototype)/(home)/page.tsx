"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { OrganizationsCol } from "@/modules/api";
import Button from "@mui/material/Button";
import { PRODUCTS } from "./data";
import Grid from "@mui/material/Grid";
import React from "react";
import Header from "./_page/Header";
import BottomTab from "./_page/BottomTab";
import { BOTTOM_TAB_MENU_HEIGHT } from "./_page/constants";
import ChatApp from "./_page/ChatApp";
import { useUserContext } from "@/app/_layout/UserProvider";
import { useLastCreatedOrganization } from "@/modules/api/client";
import PageLoader from "@/components/feedback/PageLoader";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function Page() {
  const { user } = useUserContext();
  const [lastCreatedOrg, isLoadingLastCreatedOrg, loadingLastCreatedOrgError] =
    useLastCreatedOrganization();

  if (isLoadingLastCreatedOrg) {
    return <PageLoader />;
  }

  if (loadingLastCreatedOrgError || !lastCreatedOrg) {
    return <ErrorPage />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100vh - ${BOTTOM_TAB_MENU_HEIGHT + 4}px)`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Header />
        <Main />
      </Box>

      <ChatApp
        app_id={lastCreatedOrg?.id}
        context={{
          user: {
            id: user?.uid || "1",
            name: user?.displayName || `Cliente da ${lastCreatedOrg.name}`,
            photoURL: user?.photoURL || "",

            // TODO: put better fake data here
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        }}
      />

      <BottomTab
        sx={{
          height: `${BOTTOM_TAB_MENU_HEIGHT}px`,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
    </Box>
  );
}

function Main() {
  return (
    <React.Fragment>
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
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* <N8NChat /> */}
    </React.Fragment>
  );
}

function ProductCard({
  product,
}: {
  product: OrganizationsCol.ProductsSubCol.Doc;
}) {
  const { name, features, prices } = product;

  const secondFeature = features[1];
  const restFeatures = features.slice(2);

  // TODO: use currency
  const price = prices[0];
  const { currency, unit_amount, recurring } = price;
  const formattedPrice = `R$ ${unit_amount} /${humanReadableRecurring(
    recurring
  )}`;
  return (
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
          {getFormattedName(name)}
        </Typography>

        <Typography variant="h5" component={"p"} gutterBottom>
          {getDataAmount(product)}
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
  );
}

function ErrorPage() {
  return (
    <Box>
      <Alert severity="error">
        <AlertTitle>Erro</AlertTitle>
        Ocorreu algum erro. Esse protótipo funciona buscando dados da última
        organização criada. Se você não criou nenhuma organização, crie uma para
        ver o protótipo funcionando.
      </Alert>
    </Box>
  );
}

function getFormattedName(name: string) {
  // "Vivo Controle 8GB", "Vivo Fibra 200MB", "Vivo TV HD", "Vivo Combo TV + Internet", "Vivo Controle 15GB"
  // Replace {number}GB and {number}MB
  return name.replace(/\s+\d+GB$/, "").replace(/\s+\d+MB$/, "");
}

function getDataAmount({
  name,
  features,
}: OrganizationsCol.ProductsSubCol.Doc) {
  // Check if name has a number followed by GB or MB
  const match = name.match(/\d+(GB|MB)/);
  if (!match) {
    // Check if features has a number followed by GB or MB
    const featureMatch = features.find((feature) =>
      feature.match(/\d+(GB|MB)/)
    );
    if (!featureMatch) {
      return "-";
    }

    return featureMatch;
  }

  return match[0];
}

function humanReadableRecurring(
  recurring: OrganizationsCol.ProductsSubCol.Price["recurring"]
) {
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
