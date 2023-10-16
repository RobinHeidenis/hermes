"use client";

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

const theme = createTheme({});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme} defaultColorScheme={"dark"}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
