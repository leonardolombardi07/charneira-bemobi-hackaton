"use client";

import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import { usePathname } from "next/navigation";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";

const PATHNAME = {
  HOME: "organization/products",
  PROFILE: "profile",
} as const;

export default function BottomTabMenu({
  sx,
}: {
  sx?: React.ComponentProps<typeof Paper>["sx"];
}) {
  const pathname = usePathname();

  const value = pathname.includes(PATHNAME.PROFILE)
    ? PATHNAME.PROFILE
    : pathname.includes(PATHNAME.HOME)
    ? PATHNAME.HOME
    : null;

  return (
    <Paper
      sx={{
        ...sx,
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
          label="Perfil"
          icon={<ProfileIcon />}
          LinkComponent={Link}
          href={`/${PATHNAME.PROFILE}`}
          value={PATHNAME.PROFILE}
        />
      </BottomNavigation>
    </Paper>
  );
}
