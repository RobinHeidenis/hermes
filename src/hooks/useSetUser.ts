import type { User } from "lucia";
import { useSetAtom } from "jotai";
import { userAtom } from "~/utils/userAtom";
import { useEffect } from "react";

export const useSetUser = (user: User | null) => {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);
};
