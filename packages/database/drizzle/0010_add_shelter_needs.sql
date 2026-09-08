CREATE TABLE IF NOT EXISTS "shelter_needs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"cards" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);