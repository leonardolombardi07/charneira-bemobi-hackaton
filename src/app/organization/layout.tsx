import type { Metadata } from "next";
import { APP_NAME } from "./constants";
import AuthenticationRouter from "./_layout/AuthenticationRouter";

export const metadata: Metadata = {
  title: `${APP_NAME}`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthenticationRouter>{children}</AuthenticationRouter>;
}
