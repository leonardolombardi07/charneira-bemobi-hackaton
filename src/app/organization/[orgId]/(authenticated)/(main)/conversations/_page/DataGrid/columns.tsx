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
    valueGetter: ({ row }) => {
      if (row.lastPart) {
        return new Date(row.lastPart.updatedAt).toLocaleString();
      }

      return new Date(row.updatedAt).toLocaleString();
    },
    minWidth: 140,
  },

  {
    field: "members",
    headerName: "Membros",
    minWidth: 140,
    valueGetter: (params) => {
      // TODO: we could do better here
      return Object.values(params.row.members)
        .map((member) => member.name)
        .join(", ");
    },
  },
];
