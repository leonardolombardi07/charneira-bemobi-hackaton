"use client";

import React from "react";
import Button from "@mui/material/Button";
import CreateDialog from "../CreateDialog";
import { useParams } from "next/navigation";
import { useOrgAgents } from "@/modules/api/client";

export default function CreateButton() {
  const [open, setOpen] = React.useState(false);
  const params = useParams();

  // TODO: handle loading and error states
  const [data = [], isLoading, error] = useOrgAgents(params.orgId as string);

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  const disabled = data.length > 0;

  function onCreate() {
    if (disabled) {
      return alert(
        "Você já possui um agente cadastrado. Atualmente é possível ter apenas um agente por organização."
      );
    }

    openDialog();
  }

  return (
    <React.Fragment>
      <Button variant="contained" color="primary" onClick={onCreate}>
        Criar Agente
      </Button>

      <CreateDialog open={open} closeDialog={closeDialog} />
    </React.Fragment>
  );
}
