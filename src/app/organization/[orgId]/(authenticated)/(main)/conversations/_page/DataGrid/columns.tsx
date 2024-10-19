import { GridColDef } from "@mui/x-data-grid";
import { Row } from "./types";
import Chip from "@mui/material/Chip";

type ColumnWithTypedField = GridColDef<Row> & {
  field: keyof Row;
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
    field: "agents",
    headerName: "Agentes",
    minWidth: 140,
    renderCell: (params) => {
      return params.row.agents.map((agent) => (
        <Chip
          key={agent.id}
          variant="outlined"
          color="primary"
          label={agent.name}
        />
      ));
    },
  },

  {
    field: "customers",
    headerName: "Clientes",
    minWidth: 140,
    renderCell: (params) => {
      return params.row.customers.map((customer) => (
        <Chip
          variant="outlined"
          color="secondary"
          key={customer.id}
          label={customer.name}
        />
      ));
    },
  },
];
