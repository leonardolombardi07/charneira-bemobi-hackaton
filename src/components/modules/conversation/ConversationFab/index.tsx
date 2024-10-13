"use client";

import React from "react";
import Popper from "@mui/material/Popper";
import Fab, { FabProps } from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import ConversationPart from "../ConversationPart";

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
  const dataToUse: any[] = [];
  return (
    <Popper
      open={open}
      className="popper-root"
      modifiers={{
        // @ts-ignore
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
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                // Make sure the scroll always starts at the bottom
                flexDirection: "column-reverse",
              }}
              // ref={partsListRef}
            >
              {dataToUse.map((p) => (
                <ConversationPart
                  key={p.id}
                  part={p}
                  part_type={p.type}
                  onReply={() => {}}
                />
              ))}

              <Box sx={{ flexGrow: 1 }} />
            </Box>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
