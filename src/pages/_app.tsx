"use client";

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "@mantine/core/styles.css";
import "~/styles/globals.css";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme={"dark"}>
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
