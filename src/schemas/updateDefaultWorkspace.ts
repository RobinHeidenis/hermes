import { z } from "zod";

export const updateDefaultWorkspaceSchema = z.object({
  workspaceId: z.string().uuid().nullable(),
});
