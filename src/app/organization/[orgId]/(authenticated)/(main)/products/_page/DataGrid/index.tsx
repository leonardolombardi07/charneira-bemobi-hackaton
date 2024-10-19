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
import {
  deleteProduct,
  useOrgProducts,
} from "@/modules/api/client/organizations/organization/products";
import ErrorIcon from "@mui/icons-material/Error";
import React from "react";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import useDialog from "@/modules/hooks/useDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { Row } from "./types";

interface DataGridProps {
  orgId: string;
}

export default function DataGrid({ orgId }: DataGridProps) {
  const [rows = [], isLoading, error] = useOrgProducts(orgId);

  const {
    selectedRowToDelete,
    isDeleteDialogOpen,
    closeDeleteDialog,
    onDelete,
    onConfirmDelete,
  } = useDelete({ orgId, rows });

  const columns: GridColDef[] = [
    ...COLUMNS,

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
        rows={error ? [] : rows}
        columns={columns}
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

    deleteProduct(selectedRowToDelete.id, orgId);
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

function Error() {
  return (
    <EmptyState
      icon={<ErrorIcon sx={{ fontSize: 60 }} />}
      title="Erro"
      description="Ocorreu um erro ao carregar seus produtos."
    />
  );
}

function NoRows() {
  return (
    <EmptyState
      icon={<EmptyDocumentsIcon sx={{ fontSize: 60 }} />}
      title="Nenhum produto"
      description="Parece que você ainda não cadastrou nenhum produto."
    />
  );
}

function NoResults() {
  return (
    <EmptyState
      icon={<EmptyDocumentsIcon sx={{ fontSize: 60 }} />}
      title="Nenhum resultado"
      description="Não encontramos nenhum produto com os filtros aplicados."
    />
  );
}
