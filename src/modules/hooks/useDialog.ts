"use client";

import * as React from "react";

export default function useDialog() {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    open,
    close,
  };
}
