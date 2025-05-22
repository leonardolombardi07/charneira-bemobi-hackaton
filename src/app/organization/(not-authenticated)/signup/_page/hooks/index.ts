"use client";

import React from "react";
import { createOrganization, signUpOrgMember } from "@/modules/api/client";
import { useNavigateToInitialUrl } from "@/app/organization/_layout/AuthenticationRouter";
import useDialog from "@/modules/hooks/useDialog";

function useSignUpWithForm() {
  const {
    isOpen: isDisabledSignUpDialogOpen,
    open: openDisabledSignUpDialog,
    close: closeDisabledSignUpDialog,
  } = useDialog();

  const orgNameRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>("");

  const goHome = useNavigateToInitialUrl();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);

    const orgName = String(formData.get("orgName"));
    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!orgName) return orgNameRef.current?.focus();
    if (!name) return nameRef.current?.focus();
    if (!email) return emailRef.current?.focus();
    if (!password) return passwordRef.current?.focus();

    setIsLoading(true);
    setSubmitError(null);
    try {
      // openDisabledSignUpDialog();

      /* ---------- TEMPORARLY DISABLED -------- */
      /* ENABLED AGAIN AT 22/05/2025 TO SHOW TO FRIENDS */
      // We need to create the organization first, so we can sign up the user
      // it must be sequential, otherwise firebase can create the user but the organization creation can fail
      const { id: orgId } = await createOrganization({
        name: orgName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        photoURL: "",
      });
      await signUpOrgMember("email/password", orgId, { email, password, name });
      goHome(orgId);
    } catch (error: any) {
      console.error(error);
      console.error(error.code);
      console.error(error.message);

      if (error.code === "auth/invalid-email") {
        setSubmitError("Email inválido");
        emailRef.current?.focus();
      } else if (error.code === "auth/email-already-in-use") {
        setSubmitError("Email já cadastrado");
        emailRef.current?.focus();
      } else if (error.code === "auth/weak-password") {
        setSubmitError("Senha fraca");
        passwordRef.current?.focus();
      } else {
        setSubmitError("Algo deu errado. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isDisabledSignUpDialogOpen,
    openDisabledSignUpDialog,
    closeDisabledSignUpDialog,
    refs: {
      orgNameRef,
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
