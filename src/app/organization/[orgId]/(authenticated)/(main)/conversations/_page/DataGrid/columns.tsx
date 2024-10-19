import { GridColDef } from "@mui/x-data-grid";
import { Row } from "./types";
import Chip, { ChipProps } from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

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
    minWidth: 170,
    renderCell: (params) => {
      return params.row.agents.map((agent) => (
        <Tooltip key={agent.id} title={agent.name} placement="top-end">
          <Chip
            key={agent.id}
            variant="outlined"
            color={getRandomChipColor()}
            label={agent.name}
            sx={{
              ...CHIP_BREAK_LINE_SX,
            }}
          />
        </Tooltip>
      ));
    },
  },

  {
    field: "customers",
    headerName: "Clientes",
    minWidth: 170,
    renderCell: (params) => {
      return params.row.customers.map((customer) => (
        <Tooltip key={customer.id} title={customer.name} placement="top-end">
          <Chip
            variant="outlined"
            color="secondary"
            key={customer.id}
            label={customer.name}
            sx={{
              ...CHIP_BREAK_LINE_SX,
            }}
          />
        </Tooltip>
      ));
    },
  },
];

const CHIP_BREAK_LINE_SX: ChipProps["sx"] = {
  p: 1,
  height: "80%",
  maxHeight: "100%",
  display: "flex",
  flexDirection: "row",
  "& .MuiChip-label": {
    overflowWrap: "break-word",
    whiteSpace: "normal",
    textOverflow: "clip",
  },
};

function getRandomChipColor(): ChipProps["color"] {
  return getRandomFromArray([
    "primary",
    "secondary",
    "default",
    "info",
    "warning",
    "success",
    "error",
  ]);
}

function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
