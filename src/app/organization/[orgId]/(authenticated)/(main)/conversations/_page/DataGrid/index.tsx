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
import { OrganizationsCol } from "@/modules/api";

interface DataGridProps {
  orgId: string;
  selectedConversation: OrganizationsCol.ConversationsSubCol.Doc | null;
  setSelectedConversation: (
    conversation: OrganizationsCol.ConversationsSubCol.Doc
  ) => void;
}

export default function DataGrid({
  orgId,
  selectedConversation,
  setSelectedConversation,
}: DataGridProps) {
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
      onRowSelectionModelChange={(newRowSelectionModel) => {
        const selectedRow = transformedRows.find(
          (row) => row.id === newRowSelectionModel[0]
        );
        if (!selectedRow) {
          alert("Ooops, conversa não encontrada. Esse foi um erro inesperado.");
          return;
        }

        setSelectedConversation(rowToConversation(selectedRow));
      }}
      rowSelectionModel={
        selectedConversation?.id ? [selectedConversation.id] : undefined
      }
      getRowHeight={() => "auto"}
      getRowId={(row) => row.id}
      slots={{
        toolbar: GridToolbar,
        noRowsOverlay: error ? Error : NoRows,
        noResultsOverlay: NoResults,
      }}
      sx={{
        ...overlaySx,
        border: "none",
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

function rowToConversation(row: Row): OrganizationsCol.ConversationsSubCol.Doc {
  const membersArray = [...row.agents, ...row.customers];

  const members = membersArray.reduce((acc = {}, member) => {
    acc[member.id] = member;
    return acc;
  }, {} as OrganizationsCol.ConversationsSubCol.Doc["members"]);

  return {
    ...row,
    members,
  };
}
