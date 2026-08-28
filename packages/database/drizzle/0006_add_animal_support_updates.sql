CREATE TABLE "animal_support_updates" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "animal_support_updates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"animal_id" integer NOT NULL,
	"author_id" integer,
	"photos" text NOT NULL,
	"recipient_count" integer NOT NULL,
	"sent_count" integer NOT NULL,
	"failed_count" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "animal_support_updates" ADD CONSTRAINT "animal_support_updates_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "animal_support_updates" ADD CONSTRAINT "animal_support_updates_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
