CREATE TABLE "adoption_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"animal_id" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"instagram" text,
	"telegram" text,
	"facebook" text,
	"location" text,
	"message" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "animals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"breed" text,
	"sex" text,
	"age_months" integer,
	"weight_kg" real,
	"size" text,
	"color" text,
	"vaccinated" boolean DEFAULT false,
	"sterilized" boolean DEFAULT false,
	"trained" boolean DEFAULT false,
	"commands" text DEFAULT '[]',
	"photos" text DEFAULT '[]',
	"contact_name" text,
	"contact_phone" text,
	"contact_email" text,
	"contact_instagram" text,
	"contact_telegram" text,
	"contact_facebook" text,
	"contact_location" text,
	"org_id" integer,
	"status" text DEFAULT 'available',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"animal_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "favorites_user_animal_unique" UNIQUE("user_id","animal_id")
);
--> statement-breakpoint
CREATE TABLE "lost_animals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"animal_type" text,
	"breed" text,
	"sex" text,
	"color" text,
	"size" text,
	"location" text,
	"last_seen_location" text,
	"last_seen_date" text,
	"contact_name" text NOT NULL,
	"contact_phone" text NOT NULL,
	"photos" text DEFAULT '[]',
	"resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text,
	"link" text,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"photo" text,
	"location" text,
	"phone" text,
	"email" text,
	"instagram" text,
	"telegram" text,
	"facebook" text,
	"website" text,
	"owner_id" integer NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user',
	"photo" text,
	"description" text,
	"phone" text,
	"instagram" text,
	"telegram" text,
	"facebook" text,
	"org_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "volunteers" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" integer NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"surname" text,
	"photo" text,
	"description" text,
	"phone" text,
	"email" text,
	"instagram" text,
	"telegram" text,
	"invite_token" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "volunteers_invite_token_unique" UNIQUE("invite_token")
);
--> statement-breakpoint
ALTER TABLE "adoption_requests" ADD CONSTRAINT "adoption_requests_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_animal_id_animals_id_fk" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;