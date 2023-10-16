import { useSession } from "next-auth/react";

export const useRequireAuth = () => {
  return useSession({
    required: true,
  });
};
