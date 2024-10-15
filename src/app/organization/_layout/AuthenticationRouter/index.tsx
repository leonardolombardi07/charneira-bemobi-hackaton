"use client";

import * as React from "react";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "@/app/_layout/UserProvider";
import PageLoader from "@/components/feedback/PageLoader";
import useDelay from "@/modules/hooks/useDelay";

const AUTH_ROUTES = [
  "/organization/signin",
  "/organization/signup",
  "/organization/forgot-password",
];

function AuthenticationRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isInAuthRoute = useIsInAuthRoute();
  const { user, isLoading } = useUserContext();
  const isAuthenticated = Boolean(user);

  const showPageLoader = isLoading || (!isAuthenticated && !isInAuthRoute);
  const delayedShowPageLoader = useDelay(showPageLoader);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isInAuthRoute) {
      router.push(`/organization/signin`);
    }
  }, [isLoading, isAuthenticated, isInAuthRoute, router, pathname]);

  if (delayedShowPageLoader) {
    // If we are waiting for data long enough, show the loader
    return <PageLoader />;
  }

  if (showPageLoader) {
    // Do not render children, user may be unauthenticated
    return null;
  }

  // See: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  // On why we need to Suspense here
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function useNavigateToInitialUrl() {
  const router = useRouter();

  const navigateToCorrectRoute = React.useCallback(
    (orgId: string) => {
      router.push(`/organization/${orgId}`);
    },
    [router]
  );

  return navigateToCorrectRoute;
}

function useIsInAuthRoute() {
  const pathname = usePathname();
  return AUTH_ROUTES.includes(pathname);
}

export { useNavigateToInitialUrl };

export default AuthenticationRouter;
