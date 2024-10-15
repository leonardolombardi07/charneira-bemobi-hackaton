"use client";

import { DataGrid as MUIDataGrid } from "@mui/x-data-grid";
import EmptyDocumentsIcon from "@mui/icons-material/Description";
import GridToolbar from "@/components/datagrid/GridToolbar";
import EmptyState from "@/components/datagrid/EmptyState";
import { overlaySx } from "@/components/datagrid/overlay";
import { COLUMNS } from "./columns";
import { useOrgConversations } from "@/modules/api/client";

interface DataGridProps {
  orgId: string;
}

export default function DataGrid({ orgId }: DataGridProps) {
  // TODO: handle loading and error states
  const [data = [], isLoading, error] = useOrgConversations(orgId);
  return (
    <MUIDataGrid
      autoHeight
      rows={data}
      getRowId={(row) => row.id}
      columns={COLUMNS}
      slots={{
        toolbar: GridToolbar,
        noRowsOverlay: NoRows,
        noResultsOverlay: NoResults,
      }}
      sx={{
        ...overlaySx,
      }}
    />
  );
}

function NoRows() {
  return (
    <EmptyState
      icon={<EmptyDocumentsIcon sx={{ fontSize: 60 }} />}
      title="Nenhuma conversa"
      description="Parece que não há nenhuma conversa cadastrada."
    />
  );
}

function NoResults() {
  return (
    <EmptyState
      icon={<EmptyDocumentsIcon sx={{ fontSize: 60 }} />}
      title="Nenhum resultado"
      description="Não encontramos nenhuma conversa com os filtros aplicados."
    />
  );
}
