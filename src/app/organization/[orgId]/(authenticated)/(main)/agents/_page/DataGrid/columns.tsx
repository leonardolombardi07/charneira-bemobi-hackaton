import { GridColDef } from "@mui/x-data-grid";
import { Row } from "./types";

type ColumnWithTypedField = GridColDef<Row> & {
  field: keyof Row;
};

export const COLUMNS: ColumnWithTypedField[] = [
  {
    field: "name",
    headerName: "Nome",
    minWidth: 150,
    editable: true,
  },
  {
    field: "description",
    headerName: "Descrição",
    minWidth: 150,
    editable: true,
  },

  {
    field: "instructions",
    headerName: "Instruções",
    minWidth: 150,
    editable: true,
  },

  {
    field: "createdAt",
    headerName: "Criado em",
    valueGetter: (params) => {
      return new Date(params.row.createdAt).toLocaleDateString();
    },
    minWidth: 140,
    editable: false,
  },
];
