import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import { api } from "~/utils/api";

export const SignOutForm = ({ children }: PropsWithChildren) => {
  const { push } = useRouter();
  const { mutate } = api.auth.logout.useMutation({
    onSuccess: () => {
      void push("/auth/login");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate();
      }}
    >
      {children}
    </form>
  );
};
