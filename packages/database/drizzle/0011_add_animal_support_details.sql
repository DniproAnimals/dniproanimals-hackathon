ALTER TABLE "animal_donations" ADD COLUMN IF NOT EXISTS "support_type" varchar(40);
ALTER TABLE "animal_donations" ADD COLUMN IF NOT EXISTS "phone" varchar(50);

UPDATE "animal_donations" AS "donation"
SET
	"support_type" = coalesce("donation"."support_type", 'financial'),
	"phone" = coalesce("donation"."phone", "user"."phone")
FROM "users" AS "user"
WHERE "donation"."user_id" = "user"."id"
	AND ("donation"."support_type" IS NULL OR "donation"."phone" IS NULL);

UPDATE "animal_donations"
SET
	"is_active" = false,
	"canceled_at" = now(),
	"updated_at" = now()
WHERE "is_active" = true
	AND ("phone" IS NULL OR btrim("phone") = '');

CREATE INDEX IF NOT EXISTS "animal_donations_animal_id_is_active_idx" ON "animal_donations" USING btree ("animal_id", "is_active", "started_at");
