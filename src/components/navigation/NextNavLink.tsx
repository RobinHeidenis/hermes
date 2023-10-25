import Link from "next/link";
import { NavLink } from "@mantine/core";
import type { ReactNode } from "react";

export const NextNavLink = ({
  href,
  label,
  leftSection,
  pathname,
}: {
  href: string;
  label: string;
  leftSection?: ReactNode;
  pathname?: string;
}) => (
  <NavLink
    component={Link}
    className={
      "hover:bg-[--mantine-color-default-hover] hover:data-[active=true]:bg-[--nl-hover]"
    }
    href={href}
    label={label}
    leftSection={leftSection}
    active={pathname === href}
  />
);
