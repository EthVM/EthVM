ALTER TABLE "transaction"
    ADD COLUMN "r_trim "VARCHAR(128) NOT NULL DEFAULT '',
    ADD COLUMN "s_trim" VARCHAR(128) NOT NULL DEFAULT '';

UPDATE "transaction"
SET "r_trim "= TRIM("r"),
    "s_trim" = TRIM("s");

DROP VIEW "canonical_transaction";

ALTER TABLE "transaction"
    DROP COLUMN "r",
    DROP COLUMN "s";

ALTER TABLE "transaction"
    RENAME COLUMN "r_trim "TO "r";

ALTER TABLE "transaction"
    RENAME COLUMN "s_trim" TO "s";

CREATE VIEW canonical_transaction AS
SELECT t.*
FROM "transaction" AS t
         RIGHT JOIN canonical_block_header AS cb ON t.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND t.hash IS NOT NULL;
