import type { LucideIcon } from "lucide-react";

export const Icon = ({
  IconComponent,
  className,
  firefoxMarginClass,
}: {
  IconComponent: LucideIcon;
  className: string;
  firefoxMarginClass?: string;
}) => {
  return (
    <IconComponent
      className={`${className} ${
        typeof window !== "undefined" &&
        navigator &&
        navigator?.userAgent.indexOf("Firefox") > -1
          ? firefoxMarginClass
          : ""
      }`}
    />
  );
};
