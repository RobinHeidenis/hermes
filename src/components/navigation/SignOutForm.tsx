import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";

export const SignOutForm = ({ children }: PropsWithChildren) => {
  const { push } = useRouter();

  return (
    <form
      method={"post"}
      action={"/api/auth/logout"}
      onSubmit={async (e) => {
        e.preventDefault();
        const formElement = e.target as HTMLFormElement;
        await fetch(formElement.action, {
          method: formElement.method,
        });
        void push("/auth/login");
      }}
    >
      {children}
    </form>
  );
};
