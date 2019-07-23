DROP VIEW canonical_uncle;

CREATE VIEW canonical_uncle AS
SELECT
  cb.number as nephew_number,
  u.*,
  fbd.amount as reward_amount
FROM
  uncle AS u
    RIGHT JOIN canonical_block_header AS cb ON u.nephew_hash = cb.hash
    LEFT JOIN fungible_balance_delta AS fbd ON u.author = fbd.address AND u.nephew_hash = fbd.trace_location_block_hash
WHERE
  fbd.delta_type = 'UNCLE_REWARD' AND
  u.hash IS NOT NULL AND
  cb.number IS NOT NULL;
