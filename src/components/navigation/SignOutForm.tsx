import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import { api } from "~/utils/api";
import { useSetAtom } from "jotai";
import { userAtom } from "~/utils/userAtom";

export const SignOutForm = ({ children }: PropsWithChildren) => {
  const setUser = useSetAtom(userAtom);
  const { push } = useRouter();
  const { mutate } = api.auth.logout.useMutation({
    onSuccess: () => {
      setUser(null);
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
