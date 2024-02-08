ALTER TYPE "category" ADD VALUE 'fixed';--> statement-breakpoint
ALTER TYPE "category" ADD VALUE 'professional';--> statement-breakpoint
ALTER TYPE "category" ADD VALUE 'transport';--> statement-breakpoint
ALTER TYPE "category" ADD VALUE 'leisure';--> statement-breakpoint
ALTER TYPE "category" ADD VALUE 'pets';--> statement-breakpoint
ALTER TABLE "users_to_workspaces" DROP CONSTRAINT "users_to_workspaces_user_id_workspace_id";--> statement-breakpoint
ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_user_id_workspace_id_pk" PRIMARY KEY("user_id","workspace_id");