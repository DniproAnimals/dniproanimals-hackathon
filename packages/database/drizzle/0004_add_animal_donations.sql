CREATE TABLE "animal_donations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "animal_donations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"animal_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"canceled_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "animal_donations_user_id_animal_id_unique" UNIQUE("user_id","animal_id")
);
--> statement-breakpoint
ALTER TABLE "animal_donations" ADD CONSTRAINT "animal_donations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "animal_donations" ADD CONSTRAINT "animal_donations_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;
