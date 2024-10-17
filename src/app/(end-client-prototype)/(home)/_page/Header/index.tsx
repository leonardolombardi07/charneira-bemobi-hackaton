"use client";

import React from "react";
import VivoLogo from "../../../_components/VivoLogo";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import AuthenticatedHeaderItem from "../AuthenticatedHeaderItem";
import NotAuthenticatedHeaderItem from "../NotAuthenticatedHeaderItem";
import { useUserContext } from "@/app/_layout/UserProvider";

interface HeaderProps {
  sx?: BoxProps["sx"];
}

export default function Header({ sx }: HeaderProps) {
  return (
    <React.Fragment>
      <Container
        sx={{
          bgcolor: "transparent",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: 0,
          pb: 2,
          ...sx,
        }}
      >
        <FirstRow />
        <SecondRow />
      </Container>

      <Divider />
    </React.Fragment>
  );
}

function FirstRow() {
  const { user } = useUserContext();
  const isAuthenticatedUser = user !== null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <VivoLogo size="small" />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          ml: 4,
        }}
      >
        <Button
          variant="text"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Para você
        </Button>

        <Button
          variant="text"
          sx={{
            color: "text.secondary",
          }}
        >
          Para Empresas
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          variant="text"
          startIcon={<AccessibilityIcon />}
          sx={{
            color: "primary.main",
          }}
        >
          Acessibilidade
        </Button>

        <Button
          variant="text"
          startIcon={<SearchIcon />}
          sx={{
            color: "text.secondary",
          }}
        >
          Buscar
        </Button>

        {isAuthenticatedUser ? (
          <AuthenticatedHeaderItem />
        ) : (
          <NotAuthenticatedHeaderItem />
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ mr: 1.5 }}>
            Ofertas para
          </Typography>

          <Select value={"Rio de Janeiro"} readOnly>
            <MenuItem value={"Rio de Janeiro"}>Rio de Janeiro</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}

function SecondRow() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        mt: 1,
        fontSize: 14,
      }}
    >
      <NavigationLink isActive={false}>Baixe o App Vivo</NavigationLink>
      <NavigationLink isActive={true}>Produtos e Serviços</NavigationLink>
      <NavigationLink isActive={false}>Ajuda</NavigationLink>
      <NavigationLink isActive={false}>Por que Vivo</NavigationLink>
      <NavigationLink isActive={true}>Melhores Ofertas</NavigationLink>
    </Box>
  );
}

function NavigationLink({
  children,
  isActive,
}: {
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Typography
      sx={{
        color: isActive ? "primary.main" : "text.primary",
        cursor: "pointer",
      }}
    >
      {children}
    </Typography>
  );
}
