ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN "email_verification_token" varchar(255);
ALTER TABLE "users" ADD COLUMN "email_verification_token_expires" timestamp;

UPDATE "users" SET "email_verified" = true;
