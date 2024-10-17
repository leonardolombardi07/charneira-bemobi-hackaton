"use client";

import React from "react";
import Button from "@mui/material/Button";
import CreateDialog from "./CreateDialog";

export default function CreateButton() {
  const [open, setOpen] = React.useState(false);

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  return (
    <React.Fragment>
      <Button variant="contained" color="primary" onClick={openDialog}>
        Adicionar Produto
      </Button>

      <CreateDialog open={open} closeDialog={closeDialog} />
    </React.Fragment>
  );
}
