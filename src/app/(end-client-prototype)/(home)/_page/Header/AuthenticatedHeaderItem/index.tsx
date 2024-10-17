"use client";

import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import MUIMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { useUserContext } from "@/app/_layout/UserProvider";
import { signOut } from "@/modules/api/client";
import Button from "@mui/material/Button";

export default function AuthenticatedHeaderItem() {
  const { user } = useUserContext();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function onClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function onClose() {
    setAnchorEl(null);
  }

  return (
    <React.Fragment>
      <Button
        variant="text"
        onClick={onClick}
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{ bgcolor: "primary.main" }}
          // src={user?.photoURL || undefined}
        >
          {user?.displayName?.charAt(0) || ""}
        </Avatar>

        <Typography
          variant="h6"
          component="div"
          sx={{
            color: "text.primary",
          }}
        >
          {user?.displayName}
        </Typography>
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={onClose} />
    </React.Fragment>
  );
}

function Menu({
  anchorEl,
  open,
  onClose,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <MUIMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        onClick={async (event) => {
          event.stopPropagation();
          try {
            await signOut();
            onClose();
          } catch (error: any) {
            alert(error?.message);
          }
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Sair
      </MenuItem>
    </MUIMenu>
  );
}
