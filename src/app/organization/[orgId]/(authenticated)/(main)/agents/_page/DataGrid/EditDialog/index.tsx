"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import EditForm from "./EditForm";
import { OrganizationsCol } from "@/modules/api";

interface EditDialogProps {
  previous: OrganizationsCol.AgentsSubCol.Doc;
  open: boolean;
  closeDialog: () => void;
}

export default function EditDialog({
  previous,
  open,
  closeDialog,
}: EditDialogProps) {
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      onClose={close}
    >
      <React.Fragment>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeDialog}>
              <CloseIcon />
            </IconButton>

            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Atualizar Agente
            </Typography>
          </Toolbar>
        </AppBar>

        <EditForm
          previous={previous}
          onEdit={closeDialog}
          onCancel={closeDialog}
        />
      </React.Fragment>
    </Dialog>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});
