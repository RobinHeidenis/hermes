import { AppShell, Burger, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type PropsWithChildren } from "react";

export const CustomAppShell = ({ children }: PropsWithChildren) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header pl={"sm"}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title>Hermes</Title>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
