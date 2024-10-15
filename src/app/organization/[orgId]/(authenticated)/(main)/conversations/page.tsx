import Box from "@mui/material/Box";
import React from "react";
import DataGrid from "./_page/DataGrid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Metadata } from "next";
import { APP_NAME } from "@/app/organization/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} | Conversas`,
};

interface PageProps {
  params: {
    orgId: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Typography variant="h4">Conversas</Typography>
      </Box>

      <DataGrid orgId={params.orgId} />
    </Container>
  );
}
