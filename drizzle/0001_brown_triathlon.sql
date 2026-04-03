CREATE TABLE "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" integer,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'uah',
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"status" text DEFAULT 'pending',
	"donor_email" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "donations_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_account_id" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_onboarding_complete" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;