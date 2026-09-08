CREATE TABLE "foundation" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "foundation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) DEFAULT 'Притулок ДніпроAnimals' NOT NULL,
	"description" text,
	"address" varchar(512),
	"phone" varchar(50),
	"email" varchar(255),
	"instagram" varchar(255),
	"telegram" varchar(255),
	"facebook" varchar(255),
	"tiktok_url" varchar(512),
	"monobank_jar_url" varchar(512),
	"monobank_card_number" varchar(64),
	"privat_bank_card_number" varchar(64),
	"paypal_email" varchar(255),
	"patreon_url" varchar(512),
	"buy_me_a_coffee_url" varchar(512),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
