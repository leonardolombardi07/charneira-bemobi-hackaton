"use client";

import {
  DataGrid as MUIDataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import EmptyAgentsIcon from "@mui/icons-material/SmartToy";
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
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import EditDialog from "./EditDialog";

interface DataGridProps {
  orgId: string;
}

export default function DataGrid({ orgId }: DataGridProps) {
  const [rows = [], isLoading, error] = useOrgAgents(orgId);

  const { selectedRowToEdit, isEditDialogOpen, closeEditDialog, onEdit } =
    useEdit({ rows });

  const {
    selectedRowToDelete,
    isDeleteDialogOpen,
    closeDeleteDialog,
    onDelete,
    onConfirmDelete,
  } = useDelete({ orgId, rows });

  const { selectedAgentToChat, onTestChat, closeConversationDialog } =
    useTestChat();

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
            color="secondary"
            startIcon={<ChatIcon />}
            onClick={() => onTestChat(params.row)}
          >
            Testar Agente
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
            icon={<EditIcon />}
            label="Editar"
            onClick={() => onEdit(params.id)}
          />,
          <GridActionsCellItem
            key={2}
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
        rows={error ? [] : rows}
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
          noRowsOverlay: error ? Error : NoRows,
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

      {selectedRowToEdit && (
        <EditDialog
          previous={selectedRowToEdit}
          open={isEditDialogOpen}
          closeDialog={closeEditDialog}
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

function useEdit({ rows }: { rows: Row[] }) {
  const [selectedRowToEdit, setSelectedRowToEdit] = React.useState<Row | null>(
    null
  );

  const {
    isOpen: isEditDialogOpen,
    open: openEditDialog,
    close: closeEditDialog,
  } = useDialog();

  function onEdit(id: GridRowId) {
    const row = rows.find((row) => row.id === id);
    if (!row) {
      return alert("Ooops, algo deu errado.");
    }

    setSelectedRowToEdit(row);
    openEditDialog();
  }

  return {
    selectedRowToEdit,
    setSelectedRowToEdit,
    isEditDialogOpen,
    openEditDialog,
    closeEditDialog,
    onEdit,
  };
}

function useDelete({ orgId, rows }: { orgId: string; rows: Row[] }) {
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

  return {
    selectedRowToDelete,
    setSelectedRowToDelete,
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    onDelete,
    onConfirmDelete,
  };
}

function useTestChat() {
  const [selectedAgentToChat, setSelectedAgentToChat] =
    React.useState<Row | null>(null);

  function closeConversationDialog() {
    setSelectedAgentToChat(null);
  }

  function onTestChat(row: Row) {
    setSelectedAgentToChat(row);
  }

  return {
    selectedAgentToChat,
    setSelectedAgentToChat,
    onTestChat,
    closeConversationDialog,
  };
}

function Error() {
  return (
    <EmptyState
      icon={<ErrorIcon sx={{ fontSize: 60 }} />}
      title="Erro"
      description="Ocorreu um erro ao carregar seus agentes."
    />
  );
}

function NoRows() {
  return (
    <EmptyState
      icon={<EmptyAgentsIcon sx={{ fontSize: 60 }} />}
      title="Nenhum agente"
      description="Parece que você ainda não criou nenhum agente."
    />
  );
}

function NoResults() {
  return (
    <EmptyState
      icon={<EmptyAgentsIcon sx={{ fontSize: 60 }} />}
      title="Nenhum resultado"
      description="Não encontramos nenhum agente com os filtros aplicados."
    />
  );
}
