"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useUser } from "@/app/_layout/UserProvider";
import Box from "@mui/material/Box";
import LinkAnonymousUserForm from "./LinkAnonymousUserForm";
import LinkAccountIcon from "@mui/icons-material/Link";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function LinkAnonymousUserButton() {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const fullScreen = useFullScreen();

  function closeDialog() {
    setIsDialogOpen(false);
  }

  return (
    <Box
      sx={{
        display: user.isAnonymous ? "block" : "none",
      }}
    >
      <Button
        onClick={() => {
          setIsDialogOpen(true);
        }}
        size="small"
        startIcon={<LinkAccountIcon />}
      >
        Conectar conta
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        PaperProps={{
          sx: {
            minWidth: {
              sm: 600,
            },
          },
        }}
        fullScreen={fullScreen}
      >
        <IconButton
          onClick={closeDialog}
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        <LinkAnonymousUserForm
          onSuccessfulLink={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </Box>
  );
}

function useFullScreen() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}
