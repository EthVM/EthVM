CREATE TABLE contract_created
(
  address                          CHAR(42) PRIMARY KEY,
  creator                          CHAR(42),
  init                             TEXT,
  code                             TEXT,
  contract_type                    VARCHAR(32),
  trace_location_block_hash        CHAR(66),
  trace_location_block_number      NUMERIC,
  trace_location_transaction_hash  CHAR(66),
  trace_location_transaction_index INT,
  trace_location_log_index         INT,
  trace_location_trace_address     TEXT,
  trace_location_timestamp         TIMESTAMP
);

CREATE TABLE contract_destroyed
(
  address                          CHAR(42) PRIMARY KEY,
  refund_address                   CHAR(66),
  refund_balance                   NUMERIC,
  trace_location_block_hash        CHAR(66),
  trace_location_block_number      NUMERIC,
  trace_location_transaction_hash  CHAR(66),
  trace_location_transaction_index INT,
  trace_location_log_index         INT,
  trace_location_trace_address     TEXT,
  trace_location_timestamp         TIMESTAMP
);

DROP VIEW canonical_erc20_balance;
DROP VIEW canonical_account;
DROP VIEW canonical_erc721_balance;
DROP VIEW canonical_token_exchange_rates;
DROP VIEW canonical_contract;

CREATE VIEW canonical_contract AS
SELECT
  cc.address as address,
  cc.creator as creator,
  cc.init as init,
  cc.code as code,
  cc.contract_type as contract_type,
  cd.refund_address as refund_address,
  cd.refund_balance as refund_balance,
  cc.trace_location_block_hash as trace_created_at_block_hash,
  cc.trace_location_block_number as trace_created_at_block_number,
  cc.trace_location_transaction_hash as trace_created_at_transaction_hash,
  cc.trace_location_transaction_index as trace_created_at_transaction_index,
  cc.trace_location_log_index as trace_created_at_log_index,
  cc.trace_location_trace_address as trace_created_at_trace_address,
  cc.trace_location_timestamp as trace_created_at_timestamp,
  cd.trace_location_block_hash as trace_destroyed_at_block_hash,
  cd.trace_location_block_number as trace_destroyed_at_block_number,
  cd.trace_location_transaction_hash as trace_destroyed_at_transaction_hash,
  cd.trace_location_transaction_index as trace_destroyed_at_transaction_index,
  cd.trace_location_log_index as trace_destroyed_at_log_index,
  cd.trace_location_trace_address as trace_destroyed_at_trace_address,
  cd.trace_location_timestamp as trace_destroyed_at_timestamp,
  COALESCE(cd.trace_location_timestamp, cc.trace_location_timestamp) as timestamp
FROM
     contract_created AS cc
      LEFT JOIN contract_destroyed AS cd ON cc.address = cd.address
WHERE
  cc.trace_location_block_hash IS NOT NULL;


CREATE VIEW canonical_erc20_balance AS
SELECT fb.contract,
       fb.address,
       fb.amount
FROM fungible_balance AS fb
       LEFT JOIN canonical_contract as c on fb.contract = c.address
WHERE fb.contract IS NOT NULL
  AND fb.contract != ''
  AND c.contract_type = 'ERC20';

CREATE VIEW canonical_account AS
SELECT fb.address,
       fb.amount                       AS balance,
       (SELECT total_in + total_out
        FROM transaction_count AS tc
        WHERE tc.address = fb.address) AS total_tx_count,
       (SELECT total_in
        FROM transaction_count AS tc
        WHERE tc.address = fb.address) AS in_tx_count,
       (SELECT total_out
        FROM transaction_count AS tc
        WHERE tc.address = fb.address) AS out_tx_count,
       CASE
         WHEN cont.creator IS NULL THEN
           FALSE
         ELSE
           TRUE
         END                           AS is_contract
FROM fungible_balance AS fb
       LEFT JOIN canonical_contract AS cont ON fb.address = cont.address
WHERE fb.contract = ''
ORDER BY balance DESC;

CREATE VIEW canonical_erc721_balance AS
SELECT nfb.*
FROM non_fungible_balance AS nfb
       LEFT JOIN canonical_contract as c on nfb.contract = c.address
WHERE nfb.contract IS NOT NULL
  AND nfb.contract != ''
  AND c.contract_type = 'ERC721';

CREATE VIEW canonical_token_exchange_rates AS
SELECT ter.*
FROM token_exchange_rates AS ter
       INNER JOIN canonical_contract AS cc on ter.address = cc.address;

DROP TABLE contract;
