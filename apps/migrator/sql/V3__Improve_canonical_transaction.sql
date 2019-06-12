DROP VIEW canonical_transaction;

/* recreate canonical_transaction view with "successful" field to represent trace status */
CREATE VIEW canonical_transaction AS
SELECT t.*,
      tt.root_error,
        CASE
          WHEN root_error IS NULL THEN true
          ELSE false
        END
      AS successful
FROM "transaction" AS t
       RIGHT JOIN canonical_block_header AS cb ON t.block_hash = cb.hash
       LEFT JOIN canonical_transaction_trace AS tt ON t.hash = tt.transaction_hash
WHERE cb.number IS NOT NULL
  AND t.hash IS NOT NULL;
