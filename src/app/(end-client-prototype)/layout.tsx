import type { Metadata } from "next";
import { APP_NAME } from "./constants";
import React from "react";

export const metadata: Metadata = {
  title: `${APP_NAME}`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <React.Fragment>{children}</React.Fragment>;
}
