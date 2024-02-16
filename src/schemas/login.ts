import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1).max(30),
  password: z.string().min(10).max(64),
});
