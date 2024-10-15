import { GridColDef } from "@mui/x-data-grid";
import { DataItem } from "./types";

type ColumnWithTypedField = GridColDef<DataItem> & {
  field: keyof DataItem;
};

export const COLUMNS: ColumnWithTypedField[] = [
  {
    field: "name",
    headerName: "Nome",
    minWidth: 150,
  },
  {
    field: "description",
    headerName: "Descrição",
    minWidth: 150,
  },

  {
    field: "createdAt",
    headerName: "Criado em",
    valueGetter: (params) => {
      return new Date(params.row.createdAt).toLocaleString();
    },
    minWidth: 140,
  },
];
