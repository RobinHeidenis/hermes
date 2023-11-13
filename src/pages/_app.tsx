"use client";

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Notifications } from "@mantine/notifications";
// @ts-expect-error Types are broken but this works don't worry about it
import { useNextRouterViewTransitions } from "use-view-transitions/next";
import { useRouter } from "next/router";

const theme = createTheme({
  breakpoints: {
    sm: "40em",
    md: "46em",
    lg: "64em",
    xl: "80em",
    "2xl": "96em",
    "3xl": "131.25em",
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  // Don't worry about it, this works trust me
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  useNextRouterViewTransitions(router);

  return (
    <UserProvider>
      <MantineProvider theme={theme} defaultColorScheme={"dark"}>
        <Notifications />
        <ModalsProvider>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </ModalsProvider>
      </MantineProvider>
    </UserProvider>
  );
};

export default api.withTRPC(MyApp);
