"use client";

import React from "react";
import { signUp } from "@/modules/api/client";
import { useNavigateToInitialUrl } from "@/app/_layout/AuthenticationRouter";

function useSignUpWithForm() {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>("");

  const navigateWithPossibleRedirect = useNavigateToInitialUrl();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!name) return nameRef.current?.focus();
    if (!email) return emailRef.current?.focus();
    if (!password) return passwordRef.current?.focus();

    setIsLoading(true);
    setSubmitError(null);
    try {
      await signUp("email/password", { email, password, name });
      navigateWithPossibleRedirect();
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        setSubmitError("Invalid email");
        emailRef.current?.focus();
      } else if (error.code === "auth/email-already-in-use") {
        setSubmitError("Email already in use");
        emailRef.current?.focus();
      } else if (error.code === "auth/weak-password") {
        setSubmitError("Weak password");
        passwordRef.current?.focus();
      } else {
        setSubmitError("Algo deu errado. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    refs: {
      nameRef,
      emailRef,
      passwordRef,
    },
    isLoading,
    submitError,
    onSubmit,
  };
}

export { useSignUpWithForm };
