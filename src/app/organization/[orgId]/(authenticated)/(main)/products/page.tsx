import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DataGrid from "./_page/DataGrid";
import CreateButton from "./_page/CreateButton";
import { Metadata } from "next";
import { APP_NAME } from "@/app/organization/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} | Produtos`,
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
        <Typography variant="h4">Produtos</Typography>
        <CreateButton />
      </Box>

      <DataGrid orgId={params.orgId} />
    </Container>
  );
}
