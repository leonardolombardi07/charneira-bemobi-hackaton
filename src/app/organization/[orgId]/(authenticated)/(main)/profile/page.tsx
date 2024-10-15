import React from "react";
import ClientPage from "./client";
import type { Metadata } from "next";
import { APP_NAME } from "@/app/organization/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} | Profile`,
};

export default function Page() {
  return <ClientPage />;
}
