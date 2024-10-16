"use client";

import {
  DataGrid as MUIDataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import EmptyDocumentsIcon from "@mui/icons-material/Description";
import GridToolbar from "@/components/datagrid/GridToolbar";
import EmptyState from "@/components/datagrid/EmptyState";
import { overlaySx } from "@/components/datagrid/overlay";
import { COLUMNS } from "./columns";
import { deleteAgent, updateAgent, useOrgAgents } from "@/modules/api/client";
import React from "react";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import useDialog from "@/modules/hooks/useDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import { Row } from "./types";
import ConversationDialog from "./ConversationDialog";
import Button from "@mui/material/Button";

interface DataGridProps {
  orgId: string;
}

export default function DataGrid({ orgId }: DataGridProps) {
  // TODO: handle loading and error states
  const [rows = [], isLoading, error] = useOrgAgents(orgId);

  const [selectedAgentToChat, setSelectedAgentToChat] =
    React.useState<Row | null>(null);

  function closeConversationDialog() {
    setSelectedAgentToChat(null);
  }

  function onChat(row: Row) {
    setSelectedAgentToChat(row);
  }

  const [selectedRowToDelete, setSelectedRowToDelete] =
    React.useState<Row | null>(null);

  const {
    isOpen: isDeleteDialogOpen,
    open: openDeleteDialog,
    close: closeDeleteDialog,
  } = useDialog();

  function onDelete(id: GridRowId) {
    const row = rows.find((row) => row.id === id);
    if (!row) {
      return alert("Ooops, algo deu errado.");
    }

    setSelectedRowToDelete(row);
    openDeleteDialog();
  }

  async function onConfirmDelete() {
    if (!selectedRowToDelete) {
      return alert("Ooops, algo deu errado.");
    }

    deleteAgent(orgId, selectedRowToDelete.id);
    closeDeleteDialog();
  }

  const columns: GridColDef[] = [
    ...COLUMNS,
    {
      field: "chat",
      type: "actions",
      align: "center",
      headerName: "",
      getActions: (params) => {
        return [
          <Button
            key={0}
            variant="text"
            startIcon={<ChatIcon />}
            onClick={() => onChat(params.row)}
          >
            Conversar
          </Button>,
        ];
      },
    },
    {
      field: "actions",
      type: "actions",
      align: "center",
      headerName: "",
      getActions: (params) => {
        return [
          <GridActionsCellItem
            key={1}
            icon={<DeleteIcon />}
            label="Deletar"
            onClick={() => onDelete(params.id)}
          />,
        ];
      },
    },
  ];

  return (
    <React.Fragment>
      <MUIDataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        autoHeight
        getRowHeight={() => "auto"}
        getRowId={(row) => row.id}
        editMode="row"
        processRowUpdate={async (newRow, oldRow) => {
          const isUpdatingPrompt =
            JSON.stringify(newRow.prompts) !== JSON.stringify(oldRow.prompts);
          if (isUpdatingPrompt) {
            const correctedNewRow = {
              ...newRow,
              prompts: [newRow.prompts],
            };
            updateAgent(newRow.id, correctedNewRow);
            return newRow;
          }

          updateAgent(newRow.id, newRow);
          return newRow;
        }}
        onProcessRowUpdateError={(error) => {
          alert(error?.message || "An error ocurred.");
        }}
        slots={{
          toolbar: GridToolbar,
          noRowsOverlay: NoRows,
          noResultsOverlay: NoResults,
        }}
        sx={{
          ...overlaySx,
        }}
      />

      {selectedAgentToChat && (
        <ConversationDialog
          agent={selectedAgentToChat}
          onClose={closeConversationDialog}
        />
      )}

      <ConfirmDialog
        title="Deletar Item"
        description={`Tem certeza que você deseja deletar "${selectedRowToDelete?.name}"?`}
        cancelText="Cancelar"
        confirmText="Deletar"
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </React.Fragment>
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
