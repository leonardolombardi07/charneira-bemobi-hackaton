"use client";

import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MUIDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { DRAWER_WIDTH } from "../constants";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import ConversationIcon from "@mui/icons-material/Chat";
import AgentIcon from "@mui/icons-material/SmartToy";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAME } from "@/app/organization/constants";
import Logo from "@/components/elements/Logo";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const PATHNAME = {
  HOME: "products",
  CONVERSATIONS: "conversations",
  AGENTS: "agents",
  PROFILE: "profile",
} as const;

interface DrawerProps {
  mobileOpen: boolean;
  setMobileOpen: (mobileOpen: boolean) => void;
  setIsClosing: (isClosing: boolean) => void;
}

export default function Drawer({
  mobileOpen,
  setMobileOpen,
  setIsClosing,
}: DrawerProps) {
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
    >
      <MUIDrawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        <DrawerContent closeDrawer={handleDrawerClose} />
      </MUIDrawer>

      <MUIDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
        open
      >
        <DrawerContent closeDrawer={handleDrawerClose} />
      </MUIDrawer>
    </Box>
  );
}

function DrawerContent({ closeDrawer }: { closeDrawer: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  function isSelected(path: keyof typeof PATHNAME) {
    return pathname.includes(PATHNAME[path]);
  }

  function onClick(path: keyof typeof PATHNAME) {
    closeDrawer();
    router.push(PATHNAME[path]);
  }

  return (
    <React.Fragment>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          rowGap: 2,
          py: 0.5,
        }}
      >
        <IconButton
          color="inherit"
          edge="start"
          onClick={closeDrawer}
          sx={{ display: { sm: "none" }, mr: 2 }}
        >
          <CloseIcon />
        </IconButton>

        <LogoWithTitle />
      </Toolbar>
      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected("HOME")}
            LinkComponent={Link}
            href={PATHNAME.HOME}
            onClick={() => onClick("HOME")}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Início"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected("CONVERSATIONS")}
            LinkComponent={Link}
            href={PATHNAME.CONVERSATIONS}
            onClick={() => onClick("CONVERSATIONS")}
          >
            <ListItemIcon>
              <ConversationIcon />
            </ListItemIcon>
            <ListItemText primary={"Conversas"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected("AGENTS")}
            LinkComponent={Link}
            href={PATHNAME.AGENTS}
            onClick={() => onClick("AGENTS")}
          >
            <ListItemIcon>
              <AgentIcon />
            </ListItemIcon>
            <ListItemText primary={"Agentes"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected("PROFILE")}
            LinkComponent={Link}
            href={PATHNAME.PROFILE}
            onClick={() => onClick("PROFILE")}
          >
            <ListItemIcon>
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText primary={"Perfil"} />
          </ListItemButton>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

function LogoWithTitle() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <Logo size="small" />
      <Typography
        variant="h6"
        component="h2"
        color={(t) => {
          const isDark = t.palette.mode === "dark";
          return isDark ? "secondary.main" : "inherit";
        }}
        sx={{
          ml: "3px",
        }}
      >
        {APP_NAME}™
      </Typography>
    </Box>
  );
}
