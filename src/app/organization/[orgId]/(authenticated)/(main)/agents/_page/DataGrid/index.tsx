"use client";

import { DataGrid as MUIDataGrid } from "@mui/x-data-grid";
import EmptyDocumentsIcon from "@mui/icons-material/Description";
import GridToolbar from "@/components/datagrid/GridToolbar";
import EmptyState from "@/components/datagrid/EmptyState";
import { overlaySx } from "@/components/datagrid/overlay";
import { COLUMNS } from "./columns";
import { useOrgAgents } from "@/modules/api/client";

interface DataGridProps {
  orgId: string;
}

export default function DataGrid({ orgId }: DataGridProps) {
  // TODO: handle loading and error states
  const [data = [], isLoading, error] = useOrgAgents(orgId);
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
      title="Nenhum agente"
      description="Parece que você ainda não criou nenhum agente."
    />
  );
}

function NoResults() {
  return (
    <EmptyState
      icon={<EmptyDocumentsIcon sx={{ fontSize: 60 }} />}
      title="Nenhum resultado"
      description="Não encontramos nenhum agente com os filtros aplicados."
    />
  );
}
