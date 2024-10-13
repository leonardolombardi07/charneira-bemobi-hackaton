"use client";

import * as React from "react";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "../UserProvider";
import PageLoader from "@/components/feedback/PageLoader";
import useDelay from "@/modules/hooks/useDelay";
import { signIn } from "@/modules/api/client";

function AuthenticationRouter({ children }: { children: React.ReactNode }) {
  const { isLoading } = useUserContext();
  const showPageLoader = isLoading;
  const delayedShowPageLoader = useDelay(isLoading);

  React.useEffect(() => {
    async function onFirstMount() {
      try {
        await signIn("anonymous");
      } catch (error) {
        // Do nothing now
      }
    }

    onFirstMount();
  }, []);

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
