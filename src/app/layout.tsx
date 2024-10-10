import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { APP_NAME } from "./constants";
import ThemeProvider from "./_layout/ThemeProvider";
import UserProvider from "./_layout/UserProvider";
import AuthenticationRouter from "./_layout/AuthenticationRouter";

export const metadata: Metadata = {
  title: `${APP_NAME}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <UserProvider>
              <AuthenticationRouter>{children}</AuthenticationRouter>
            </UserProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
