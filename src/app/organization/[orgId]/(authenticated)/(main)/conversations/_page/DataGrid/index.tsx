"use client";

import { DataGrid as MUIDataGrid } from "@mui/x-data-grid";
import GridToolbar from "@/components/datagrid/GridToolbar";
import EmptyState from "@/components/datagrid/EmptyState";
import ErrorIcon from "@mui/icons-material/Error";
import { overlaySx } from "@/components/datagrid/overlay";
import { COLUMNS } from "./columns";
import { useOrgConversations } from "@/modules/api/client";
import EmptyConversationsIcon from "@mui/icons-material/Chat";
import { Row } from "./types";

interface DataGridProps {
  orgId: string;
}

export default function DataGrid({ orgId }: DataGridProps) {
  const [rows = [], isLoading, error] = useOrgConversations(orgId);

  const transformedRows: Row[] = rows.map((row) => ({
    ...row,
    agents: Object.values(row.members || {}).filter(
      (member) => member.type === "bot"
    ),
    customers: Object.values(row.members || {}).filter(
      (member) => member.type === "user"
    ),
  }));

  return (
    <MUIDataGrid
      rows={error ? [] : transformedRows}
      columns={COLUMNS}
      loading={isLoading}
      autoHeight
      getRowHeight={() => "auto"}
      getRowId={(row) => row.id}
      slots={{
        toolbar: GridToolbar,
        noRowsOverlay: error ? Error : NoRows,
        noResultsOverlay: NoResults,
      }}
      sx={{
        ...overlaySx,
      }}
    />
  );
}

function Error() {
  return (
    <EmptyState
      icon={<ErrorIcon sx={{ fontSize: 60 }} />}
      title="Erro"
      description="Ocorreu um erro ao carregar suas conversas."
    />
  );
}

function NoRows() {
  return (
    <EmptyState
      icon={<EmptyConversationsIcon sx={{ fontSize: 60 }} />}
      title="Nenhuma conversa"
      description="Parece que não há nenhuma conversa cadastrada."
    />
  );
}

function NoResults() {
  return (
    <EmptyState
      icon={<EmptyConversationsIcon sx={{ fontSize: 60 }} />}
      title="Nenhum resultado"
      description="Não encontramos nenhuma conversa com os filtros aplicados."
    />
  );
}
