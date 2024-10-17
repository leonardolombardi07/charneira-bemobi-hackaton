"use client";

import React from "react";
import Button from "@mui/material/Button";
import AccountIcon from "@mui/icons-material/AccountCircle";
import useDialog from "@/modules/hooks/useDialog";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SignInForm from "../SignInForm";
import SignUpForm from "../SignUpForm";
import Box from "@mui/material/Box";

export default function NotAuthenticatedHeaderItem() {
  const {
    isOpen: isDialogOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialog();

  const fullScreen = useFullScreen();

  const [tabsValue, setTabsValue] = React.useState<"signIn" | "signUp">(
    "signIn"
  );

  return (
    <React.Fragment>
      <Button
        variant="text"
        startIcon={<AccountIcon />}
        sx={{
          color: "text.secondary",
        }}
        onClick={openDialog}
      >
        Entrar
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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabsValue}
            onChange={(event, newValue) => setTabsValue(newValue)}
            indicatorColor="primary"
            color="primary"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab value={"signIn"} label="Entrar" />
            <Tab value={"signUp"} label="Cadastrar" />
          </Tabs>
        </Box>

        <Box
          sx={{
            p: 4,
          }}
        >
          {tabsValue === "signIn" ? (
            <SignInForm onSuccess={closeDialog} onCancel={closeDialog} />
          ) : (
            <SignUpForm onSuccess={closeDialog} onCancel={closeDialog} />
          )}
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

function useFullScreen() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}
