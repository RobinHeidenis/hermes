"use client";

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "@mantine/core/styles.css";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <MantineProvider theme={theme} defaultColorScheme={"dark"}>
        <Component {...pageProps} />
      </MantineProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
