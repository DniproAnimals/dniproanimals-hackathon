CREATE TABLE IF NOT EXISTS "foundation" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" varchar(255) NOT NULL DEFAULT 'Притулок ДніпроAnimals',
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
  "updated_at" timestamp NOT NULL DEFAULT now()
);

ALTER TABLE "foundation" ADD COLUMN "tiktok_url" varchar(512);
ALTER TABLE "foundation" ADD COLUMN "monobank_card_number" varchar(64);
ALTER TABLE "foundation" ADD COLUMN "privat_bank_card_number" varchar(64);

INSERT INTO "foundation" (
  "name",
  "address",
  "phone",
  "email",
  "instagram",
  "telegram",
  "facebook",
  "tiktok_url",
  "monobank_jar_url",
  "monobank_card_number",
  "privat_bank_card_number"
)
SELECT
  'Притулок ДніпроAnimals',
  'м. Дніпро, вул. Героїв Дніпра',
  '+380 96 660 18 17',
  'dniproanimals.org@gmail.com',
  'dniproanimals',
  'itsmotherofcats',
  'dniproanimals',
  'https://www.tiktok.com/@dniproanimals',
  'https://send.monobank.ua/jar/4441114441727326',
  '4441 1144 4172 7326',
  '5168 7456 0790 6259'
WHERE NOT EXISTS (SELECT 1 FROM "foundation");