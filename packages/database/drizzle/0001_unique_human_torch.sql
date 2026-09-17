ALTER TABLE "lost_animals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organizations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "volunteers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "lost_animals" CASCADE;--> statement-breakpoint
DROP TABLE "organizations" CASCADE;--> statement-breakpoint
DROP TABLE "volunteers" CASCADE;--> statement-breakpoint
ALTER TABLE "animals" DROP CONSTRAINT "animals_org_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_org_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "animals" ALTER COLUMN "vaccinated" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "animals" ALTER COLUMN "vaccinated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "animals" ALTER COLUMN "sterilized" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "animals" ALTER COLUMN "sterilized" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "animals" ALTER COLUMN "trained" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "animals" ALTER COLUMN "trained" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "animals" DROP COLUMN "org_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "org_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "org_id";