DROP VIEW canonical_uncle;

CREATE VIEW canonical_uncle AS
SELECT
  u.*
FROM
  uncle AS u
    RIGHT JOIN canonical_block_header AS cb ON u.nephew_hash = cb.hash
WHERE
  u.hash IS NOT NULL AND
  cb.number IS NOT NULL;
