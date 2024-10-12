"use client";

import React from "react";
import Popper from "@mui/material/Popper";
import Fab, { FabProps } from "@mui/material/Fab";
import AIIcon from "@mui/icons-material/Chat";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import ConversationsList from "../ConversationsList";

interface ConversationFabProps extends FabProps {}

export default function ConversationFab({
  sx,
  children,
  ...rest
}: ConversationFabProps) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Fab
        onClick={() => {
          setIsChatOpen((p) => !p);
        }}
        sx={{
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Fab>

      <ConversationPopper
        open={isChatOpen}
        close={() => setIsChatOpen(false)}
      />
    </React.Fragment>
  );
}

interface ConversationPopperProps {
  open: boolean;
  close: () => void;
}

function ConversationPopper({ open, close }: ConversationPopperProps) {
  return (
    <Popper
      open={open}
      className="popper-root"
      modifiers={{
        offset: {
          enabled: true,
          offset: "0, 30",
        },
      }}
      placement={"right-end"}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper
            sx={{
              minWidth: 600,
              minHeight: 600,
            }}
          >
            <ConversationsList isLoading={false} data={[]} error={null} />
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
