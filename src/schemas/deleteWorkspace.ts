import { z } from "zod";

export const deleteWorkspaceSchema = z.object({
  workspaceId: z.string().uuid(),
});
