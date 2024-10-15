import { GridColDef } from "@mui/x-data-grid";
import { DataItem } from "./types";

type ColumnWithTypedField = GridColDef<DataItem> & {
  field: keyof DataItem;
};

export const COLUMNS: ColumnWithTypedField[] = [
  {
    field: "title",
    headerName: "Título",
    minWidth: 150,
  },

  {
    field: "updatedAt",
    headerName: "Atualizada em",
    valueGetter: (params) => {
      return new Date(params.row.updatedAt).toLocaleString();
    },
    minWidth: 140,
  },

  {
    field: "membersIds",
    headerName: "Membros",
    minWidth: 140,
  },
];
