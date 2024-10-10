"use client";

import React from "react";
import { signIn } from "@/modules/api/client";
import { getHumanReadableErrorMessage } from "../../../_utils";
import { useNavigateToInitialUrl } from "@/app/_layout/AuthenticationRouter";

function useSignInWithForm() {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>("");

  const navigateWithPossibleRedirect = useNavigateToInitialUrl();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!email) return emailRef.current?.focus();
    if (!password) return passwordRef.current?.focus();

    setIsLoading(true);
    setSubmitError(null);
    try {
      await signIn("email/password", { email, password });
      navigateWithPossibleRedirect();
    } catch (error: any) {
      setSubmitError(getHumanReadableErrorMessage(error));

      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-not-found"
      ) {
        emailRef.current?.focus();
      } else if (error.code === "auth/wrong-password") {
        passwordRef.current?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    refs: {
      emailRef,
      passwordRef,
    },
    isLoading,
    submitError,
    onSubmit,
  };
}

export { useSignInWithForm };
