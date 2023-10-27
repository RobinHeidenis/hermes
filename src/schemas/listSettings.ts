import { z } from "zod";

export const listSettingSchema = z.object({
  name: z.string().min(2),
  workspaceId: z.string().uuid(),
  listId: z.string().uuid().nullable(),
});
