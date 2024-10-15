"use client";

import React from "react";
import Box from "@mui/material/Box";
import Header, { HeaderSkeleton } from "./_page/Header";
import Container from "@mui/material/Container";
import PersonalPreferences from "./_page/PersonalPreferences";
import { useUser } from "@/app/_layout/UserProvider";
import { useOrgMember } from "@/modules/api/client";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import useDelay from "@/modules/hooks/useDelay";
import { useParams } from "next/navigation";

export default function ClientPage() {
  const { user: authUser } = useUser();
  const params = useParams();
  const [firestoreOrgMember, _, error] = useOrgMember(
    params.orgId as string,
    authUser.uid as string
  );

  const delayedIsLoading = useDelay(!Boolean(firestoreOrgMember));

  return (
    <Container
      component={"main"}
      sx={{
        py: 4,
      }}
    >
      {error && (
        <Alert severity="error">
          <AlertTitle>Erro</AlertTitle>
          {error?.message}
        </Alert>
      )}

      {delayedIsLoading ? (
        <HeaderSkeleton />
      ) : (
        <Header name={firestoreOrgMember?.name} email={authUser.email} />
      )}

      <Box sx={{ my: 3 }} />
      <PersonalPreferences />
    </Container>
  );
}
