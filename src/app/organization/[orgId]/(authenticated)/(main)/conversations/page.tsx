import Box from "@mui/material/Box";
import React from "react";
import Typography from "@mui/material/Typography";
import { Metadata } from "next";
import { APP_NAME } from "@/app/organization/constants";
import ClientEntry from "./client";

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
    <Box
      sx={{
        px: 0,
        py: 0,
      }}
    >
      <ClientEntry params={params} />
    </Box>
  );
}
