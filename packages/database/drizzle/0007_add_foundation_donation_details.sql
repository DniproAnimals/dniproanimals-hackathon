CREATE TABLE "bank_details" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bank_details_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"direct_bank_details" jsonb NOT NULL,
	"foreign_currency_account" jsonb NOT NULL,
	"correspondent_banks" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);