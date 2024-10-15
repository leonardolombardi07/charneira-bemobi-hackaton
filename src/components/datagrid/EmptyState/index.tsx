import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: 300,
      }}
    >
      {icon}

      {title && <Typography variant="h5">{title}</Typography>}
      {description && (
        <Typography variant="body1" color={"text.secondary"}>
          {description}
        </Typography>
      )}

      {children}
    </Box>
  );
}

export default EmptyState;
