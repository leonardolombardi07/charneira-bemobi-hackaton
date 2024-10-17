"use client";

import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import MUIMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { useUser } from "@/app/_layout/UserProvider";
import { signOut } from "@/modules/api/client";

export default function AuthenticatedHeaderItem() {
  const { user } = useUser();

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
      <Tooltip title="Configurações">
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <IconButton onClick={onClick} size="small" sx={{ ml: 2 }}>
            <Avatar
              sx={{ bgcolor: "primary.main" }}
              src={user.photoURL || undefined}
            >
              {user.displayName?.charAt(0) || ""}
            </Avatar>
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "text.primary",
            }}
          >
            {user.displayName}
          </Typography>
        </Box>
      </Tooltip>

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
        onClick={() => {
          signOut();
          onClose();
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
