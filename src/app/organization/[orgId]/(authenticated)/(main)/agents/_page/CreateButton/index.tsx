"use client";

import React from "react";
import Button from "@mui/material/Button";
import CreateDialog from "./CreateDialog";
import { useParams } from "next/navigation";
import { useOrgAgents } from "@/modules/api/client";
import useDialog from "@/modules/hooks/useDialog";
import UpgradeDialog from "./UpgradeDialog";

export default function CreateButton() {
  const params = useParams();

  // TODO: handle loading and error states
  const [data = [], isLoading, error] = useOrgAgents(params.orgId as string);

  const {
    isOpen: isCreateDialogOpen,
    open: openCreateDialog,
    close: closeCreateDialog,
  } = useDialog();

  const {
    isOpen: isUpgradeDialogOpen,
    open: openUpgradeDialog,
    close: closeUpgradeDialog,
  } = useDialog();

  const disabled = data.length > 0;

  function onCreate() {
    if (disabled) {
      openUpgradeDialog();
      return;
    }

    openCreateDialog();
  }

  return (
    <React.Fragment>
      <Button variant="contained" color="primary" onClick={onCreate}>
        Criar Agente
      </Button>

      <CreateDialog open={isCreateDialogOpen} closeDialog={closeCreateDialog} />

      <UpgradeDialog
        open={isUpgradeDialogOpen}
        closeDialog={closeUpgradeDialog}
      />
    </React.Fragment>
  );
}
