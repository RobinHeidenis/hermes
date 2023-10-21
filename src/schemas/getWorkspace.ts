import { z } from "zod";

export const getWorkspaceSchema = z.object({
  workspaceId: z.string().uuid(),
});
