"use client";

import React from "react";
import { linkAnonymousUser } from "@/modules/api/client";

function useLinkWithProvider() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>("");

  async function linkWithProvider(provider: "google") {
    setIsLoading(true);
    setError(null);

    try {
      await linkAnonymousUser(provider);
      return { success: true };
    } catch (error: any) {
      setError(getHumanReadableErrorMessage(error));
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    error,
    linkWithProvider,
  };
}

function getHumanReadableErrorMessage(error: any) {
  return "Something went wrong. Please try again.";
}

export { useLinkWithProvider };
