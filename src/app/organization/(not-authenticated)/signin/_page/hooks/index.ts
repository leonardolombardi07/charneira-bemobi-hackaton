"use client";

import React from "react";
import { signIn, signInOrgMember } from "@/modules/api/client";
import { getHumanReadableErrorMessage } from "../../../_utils";
import { useNavigateToInitialUrl } from "@/app/organization/_layout/AuthenticationRouter";

function useSignInWithForm() {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>("");

  const goHome = useNavigateToInitialUrl();

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
      const { orgId } = await signInOrgMember("email/password", {
        email,
        password,
      });
      goHome(orgId);
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
