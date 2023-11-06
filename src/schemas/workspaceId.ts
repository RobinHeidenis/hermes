import { z } from "zod";

export const workspaceIdSchema = z.object({
  workspaceId: z.string().uuid(),
});
