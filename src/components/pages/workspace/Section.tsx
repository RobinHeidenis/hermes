import type { PropsWithChildren } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Collapse, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon as IconComponent } from "~/components/Icon";

export const Section = ({
  title,
  Icon,
  transitionName,
  children,
}: PropsWithChildren<{
  title: string;
  Icon: LucideIcon;
  transitionName?: string;
}>) => {
  const [opened, { toggle }] = useDisclosure(true);
  return (
    <>
      <div
        className={
          "mt-3 flex w-full items-center justify-center md:justify-start"
        }
        onClick={toggle}
      >
        <IconComponent
          IconComponent={Icon}
          className={"mr-2"}
          firefoxMarginClass={"mb-2"}
        />
        <Title
          order={2}
          style={{
            viewTransitionName: transitionName,
          }}
        >
          {title}
        </Title>
        <IconComponent
          IconComponent={ChevronDownIcon}
          className={`ml-3 h-5 w-5 transition-all ${
            opened ? "rotate-180" : "rotate-0"
          }`}
          firefoxMarginClass={"mb-2"}
        />
      </div>
      <Collapse in={opened}>{children}</Collapse>
    </>
  );
};
