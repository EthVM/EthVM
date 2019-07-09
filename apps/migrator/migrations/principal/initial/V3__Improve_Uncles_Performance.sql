DROP VIEW IF EXISTS canonical_block_reward;
DROP VIEW IF EXISTS canonical_uncle;
DROP VIEW IF EXISTS block_reward;
DROP VIEW IF EXISTS uncle_reward;

CREATE VIEW block_reward AS
SELECT address,
       trace_location_block_hash as block_hash,
       amount,
       delta_type
FROM fungible_balance_delta
WHERE delta_type IN ('BLOCK_REWARD', 'UNCLE_REWARD');

CREATE VIEW uncle_reward AS
SELECT address,
       trace_location_block_hash as block_hash,
       amount
FROM fungible_balance_delta
WHERE delta_type = 'UNCLE_REWARD';

CREATE VIEW canonical_uncle AS
SELECT
  cb.number as nephew_number,
  u.*,
  ur.amount as reward_amount
FROM
  uncle AS u
    RIGHT JOIN canonical_block_header AS cb ON u.nephew_hash = cb.hash
    LEFT JOIN uncle_reward AS ur ON u.author = ur.address AND u.nephew_hash = ur.block_hash
WHERE
  u.hash IS NOT NULL AND
  cb.number IS NOT NULL;

CREATE VIEW canonical_block_reward AS
SELECT br.*
FROM block_reward AS br
       RIGHT JOIN canonical_block_header AS cb ON br.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND br.amount IS NOT NULL;
