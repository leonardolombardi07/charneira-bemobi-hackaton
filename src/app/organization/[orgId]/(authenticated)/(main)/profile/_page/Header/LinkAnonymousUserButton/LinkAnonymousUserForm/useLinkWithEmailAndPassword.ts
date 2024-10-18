"use client";

import React from "react";
import { linkAnonymousUser } from "@/modules/api/client";
import { getHumanReadableErrorMessage } from "../../../../../../../../(not-authenticated)/_utils";

function useLinkWithEmailAndPassword() {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>("");

  async function linkWithEmailAndPassword(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<{ success: boolean }> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!email) {
      emailRef.current?.focus();
      return { success: false };
    }
    if (!password) {
      passwordRef.current?.focus();
      return { success: false };
    }

    setIsLoading(true);
    setSubmitError(null);
    try {
      await linkAnonymousUser("email/password", { email, password });
      return { success: true };
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
      return { success: false };
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
    linkWithEmailAndPassword,
  };
}

export { useLinkWithEmailAndPassword };
