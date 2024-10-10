"use client";

import React from "react";
import { signIn, signUp } from "@/modules/api/client";
import { usePathname } from "next/navigation";
import { getHumanReadableErrorMessage } from "../../_utils";
import { useNavigateToInitialUrl } from "@/app/_layout/AuthenticationRouter";

function useContinueWithProvider() {
  const pathname = usePathname();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>("");

  const navigateWithPossibleRedirect = useNavigateToInitialUrl();

  async function continueWithProvider(provider: "google" | "anonymous") {
    setIsLoading(true);
    setError(null);
    try {
      if (pathname.includes("/signin")) {
        await signIn(provider);
      } else if (pathname.includes("/signup")) {
        await signUp(provider);
      } else {
        throw new Error("This was not supposed to happen. So sorry.");
      }

      navigateWithPossibleRedirect();
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") return;
      setError(getHumanReadableErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    error,
    continueWithProvider,
  };
}

export { useContinueWithProvider };
