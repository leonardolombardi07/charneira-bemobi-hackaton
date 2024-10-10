"use client";

import * as React from "react";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "../UserProvider";
import PageLoader from "@/components/feedback/PageLoader";
import useDelay from "@/modules/hooks/useDelay";

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
      // Preserve the intended route in the URL
      router.push(
        `/signin?${REDIRECT_TO_INITIAL_URL_SEARCH_PARAM_KEY}=${pathname}`
      );
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

const REDIRECT_TO_INITIAL_URL_SEARCH_PARAM_KEY = "redirectTo";

function useNavigateToInitialUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get(REDIRECT_TO_INITIAL_URL_SEARCH_PARAM_KEY);

  const navigateToCorrectRoute = React.useCallback(() => {
    router.push(redirectTo || "/");
  }, [router, redirectTo]);

  return navigateToCorrectRoute;
}

const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password"];

function useIsInAuthRoute() {
  const pathname = usePathname();
  return AUTH_ROUTES.includes(pathname);
}

export { useNavigateToInitialUrl };

export default AuthenticationRouter;
