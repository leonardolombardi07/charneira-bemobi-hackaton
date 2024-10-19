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
import Plans from "./Plans";

interface UpgradeDialogProps {
  open: boolean;
  closeDialog: () => void;
}

export default function UpgradeDialog({
  open,
  closeDialog,
}: UpgradeDialogProps) {
  return (
    <Dialog
      open={open}
      fullScreen
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
              Upgrade de Plano
            </Typography>
          </Toolbar>
        </AppBar>

        <Plans closeDialog={closeDialog} />
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
  return <Slide direction="up" ref={ref} {...props} />;
});
