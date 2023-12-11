import Link from "next/link";
import { NavLink } from "@mantine/core";
import type { ReactNode } from "react";

export const NextNavLink = ({
  href,
  label,
  leftSection,
  pathname,
  className,
}: {
  href: string;
  label: string;
  leftSection?: ReactNode;
  pathname?: string;
  className?: string;
}) => (
  <NavLink
    component={Link}
    className={`hover:bg-[--mantine-color-default-hover] hover:data-[active=true]:bg-[--nl-hover] ${className}`}
    href={href}
    label={label}
    leftSection={leftSection}
    active={pathname === href}
  />
);
