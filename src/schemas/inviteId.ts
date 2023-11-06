import { z } from "zod";

export const inviteIdSchema = z.object({
  inviteId: z.string().length(5),
});
