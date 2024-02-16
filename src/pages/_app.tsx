"use client";

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useNextRouterViewTransitions } from "~/hooks/useViewTransitions";

const theme = createTheme({
  breakpoints: {
    sm: "40em",
    md: "47em",
    lg: "64em",
    xl: "80em",
    "2xl": "96em",
    "3xl": "131.25em",
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  useNextRouterViewTransitions(router);

  return (
    <MantineProvider theme={theme} defaultColorScheme={"dark"}>
      <Notifications />
      <ModalsProvider>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ModalsProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
