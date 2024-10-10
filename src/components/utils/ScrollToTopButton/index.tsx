"use client";

import * as React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fade from "@mui/material/Fade";

function ScrollToTopButton() {
  return (
    <ScrollToTopContainer>
      <Fab size="small" aria-label="scroll back to top">
        <KeyboardArrowUpIcon />
      </Fab>
    </ScrollToTopContainer>
  );
}

interface Props {
  children: React.ReactElement;
}

function ScrollToTopContainer({ children }: Props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  function onClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <Fade in={trigger}>
      <Box
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: "65px",
          right: "15px",
          zIndex: (t) => t.zIndex.drawer - 1,
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export default ScrollToTopButton;
