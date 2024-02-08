DO $$ BEGIN
 CREATE TYPE "category" AS ENUM('household', 'groceries', 'snacks', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "receipts" ADD COLUMN "name" varchar(50);--> statement-breakpoint
ALTER TABLE "receipts" ADD COLUMN "price" numeric(8, 2);--> statement-breakpoint
ALTER TABLE "receipts" ADD COLUMN "category" "category" DEFAULT 'other' NOT NULL;