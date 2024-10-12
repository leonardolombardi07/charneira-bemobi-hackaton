"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function BottomTabMenu({
  sx,
}: {
  sx?: React.ComponentProps<typeof Paper>["sx"];
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "primary.main",
        py: 4,
        px: 1,
        ...sx,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "white",
          mr: {
            xs: 1,
            sm: 4,
          },
        }}
      >
        Contrate agora
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{
          ml: 2,
          bgcolor: "white",
          color: "primary.main",
          width: 200,
          textTransform: "none",
          "&:hover": {
            bgcolor: "white",
          },
        }}
      >
        WhatsApp
      </Button>

      <Button
        variant="contained"
        size="large"
        sx={{
          ml: 2,
          bgcolor: "white",
          color: "primary.main",
          width: 200,
          textTransform: "none",
          "&:hover": {
            bgcolor: "white",
          },
        }}
      >
        Compre pelo chat
      </Button>
    </Box>
  );
}
