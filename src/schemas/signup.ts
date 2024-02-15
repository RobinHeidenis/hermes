import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(1).max(30),
  email: z.string().email().min(1),
  password: z.string().min(10).max(64),
});
