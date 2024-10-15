import { GridColDef } from "@mui/x-data-grid";
import { DataItem } from "./types";
import { Recursive } from "next/font/google";

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
    field: "prices",
    headerName: "Precificação",
    minWidth: 150,
    valueGetter: (params) => {
      const prices = params.row.prices;
      const firstPrice = prices?.[0];
      if (!firstPrice) return ``;

      const { currency, unit_amount, type, recurring } = firstPrice;
      if (!recurring) {
        return `${currency} ${unit_amount}`;
      }
      const { interval, interval_count } = recurring;

      const humanReadableInterval = {
        day: "dia",
        week: "semana",
        month: "mês",
        year: "ano",
      }[interval];

      if (interval_count === 1) {
        return `${currency} ${unit_amount} / ${humanReadableInterval}`;
      }

      const pluralized = {
        dia: "dias",
        semana: "semanas",
        mês: "meses",
        ano: "anos",
      }[humanReadableInterval];

      return `${currency} ${unit_amount} / a cada ${interval_count} ${pluralized}`;
    },
  },

  {
    field: "createdAt",
    headerName: "Criado em",
    minWidth: 140,
    valueGetter: (params) => {
      const date = new Date(params.row.createdAt);
      return date.toLocaleDateString("pt-BR");
    },
  },
];
