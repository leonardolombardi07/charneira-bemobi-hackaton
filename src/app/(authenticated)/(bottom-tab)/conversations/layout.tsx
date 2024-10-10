"use client";

/* 
Inspired by:
https://www.npmjs.com/package/react-use-intercom
https://devrnt.github.io/react-use-intercom/#/useIntercom
https://developers.intercom.com/docs/references/rest-api/api.intercom.io/conversations/conversation
*/

import React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import { usePathname } from "next/navigation";
import Link from "next/link";

const BOTTOM_TAB_MENU_HEIGHT = 56;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      {/* TODO: add animation */}
      <Box
        sx={{
          flex: 1,
          pb: `${BOTTOM_TAB_MENU_HEIGHT}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>

      <BottomTabMenu />
    </Box>
  );
}

const PATHNAME = {
  HOME: "conversations/home",
  LIST: "conversations/list",
} as const;

function BottomTabMenu() {
  const pathname = usePathname();

  const value = pathname.includes(PATHNAME.LIST)
    ? PATHNAME.LIST
    : pathname.includes(PATHNAME.HOME)
    ? PATHNAME.HOME
    : null;

  return (
    <Paper
      sx={{
        height: `${BOTTOM_TAB_MENU_HEIGHT}px`,
        position: "fixed",
        bottom: BOTTOM_TAB_MENU_HEIGHT,
        left: 0,
        right: 0,
      }}
    >
      <Divider />
      <BottomNavigation showLabels value={value}>
        <BottomNavigationAction
          label="Início"
          icon={<HomeIcon />}
          LinkComponent={Link}
          href={`/${PATHNAME.HOME}`}
          value={PATHNAME.HOME}
        />

        <BottomNavigationAction
          label="Mensagens"
          icon={<MessageIcon />}
          LinkComponent={Link}
          href={`/${PATHNAME.LIST}`}
          value={PATHNAME.LIST}
        />
      </BottomNavigation>
    </Paper>
  );
}
