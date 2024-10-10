"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useSafeGoBack() {
  const router = useRouter();

  return React.useCallback(() => {
    if (history?.length > 2) {
      // Not sure why we need 2 instead of one. Probably because of redirects?
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);
}

export function useNavigateWithSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return React.useCallback(
    (...pushParameters: Parameters<typeof router.push>) => {
      const [hrefWithoutSearchParams, options] = pushParameters;

      if (searchParams.size === 0) {
        return router.push(hrefWithoutSearchParams, options);
      }

      const href = `${hrefWithoutSearchParams}?${searchParams.toString()}`;

      return router.push(href, options);
    },
    [searchParams, router]
  );
}
