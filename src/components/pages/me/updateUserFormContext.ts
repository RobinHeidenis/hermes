import { createFormContext } from "@mantine/form";
import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email("Invalid email"),
});

export const [UserFormProvider, useUserFormContext, useUserForm] =
  createFormContext<z.infer<typeof updateUserSchema>>();
