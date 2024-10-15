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
import AgentIcon from "@mui/icons-material/Rocket";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import { usePathname } from "next/navigation";

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
        <DrawerContent />
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
        <DrawerContent />
      </MUIDrawer>
    </Box>
  );
}

function DrawerContent() {
  const pathname = usePathname();

  function isSelected(path: keyof typeof PATHNAME) {
    return pathname.includes(PATHNAME[path]);
  }

  return (
    <React.Fragment>
      <Toolbar />
      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected("HOME")}
            LinkComponent={Link}
            href={PATHNAME.HOME}
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
