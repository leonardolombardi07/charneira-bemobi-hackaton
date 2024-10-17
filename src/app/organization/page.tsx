"use client";

import React from "react";
import { useUserContext } from "../_layout/UserProvider";
import { useNavigateToInitialUrl } from "./_layout/AuthenticationRouter";
import { getUserOrgId, signOut } from "@/modules/api/client";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useUserContext();
  const router = useRouter();
  const goHome = useNavigateToInitialUrl();

  React.useEffect(() => {
    async function _getUserOrgId() {
      if (user === null) {
        // Redirect will be handled by AuthenticationRouter
        return;
      }

      try {
        const orgId = await getUserOrgId(user.uid);
        goHome(orgId);
      } catch (error: any) {
        console.log(error);
        console.log(error?.message);
        signOut();
        router.push("/organization/signin");
        console.error(error);
      }
    }

    _getUserOrgId();
  }, [user, goHome, router]);

  return null;
}
