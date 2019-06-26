create table metadata
(
  "key"   VARCHAR(64) PRIMARY KEY,
  "value" VARCHAR(256) NULL
);

INSERT INTO metadata
VALUES ('sync_status', 'true');

/* Count table to speed up count queries */

CREATE TABLE canonical_count
(
  entity VARCHAR(128) PRIMARY KEY,
  count  BIGINT
);

INSERT INTO canonical_count
VALUES ('block_header', 0),
       ('transaction', 0),
       ('transaction_trace', 0),
       ('transaction_receipt', 0),
       ('uncle', 0);

/* Canonical blocks table which is updated on fork */

CREATE TABLE canonical_block_header
(
  number             NUMERIC PRIMARY KEY,
  hash               CHAR(66)  NOT NULL UNIQUE,
  parent_hash        CHAR(66)  NOT NULL UNIQUE,
  nonce              NUMERIC   NULL,
  sha3_uncles        CHAR(66)  NOT NULL,
  logs_bloom         CHAR(514) NOT NULL,
  transactions_root  CHAR(66)  NOT NULL,
  state_root         CHAR(66)  NOT NULL,
  receipts_root      CHAR(66)  NOT NULL,
  author             CHAR(42)  NOT NULL,
  difficulty         NUMERIC   NOT NULL,
  total_difficulty   NUMERIC   NOT NULL,
  extra_data         TEXT      NULL,
  gas_limit          NUMERIC   NOT NULL,
  gas_used           NUMERIC   NOT NULL,
  timestamp          TIMESTAMP NOT NULL,
  block_time         INT       NULL,
  size               INT       NOT NULL,
  uncle_count        INT       NOT NULL,
  uncle_hashes       TEXT      NULL,
  transaction_count  INT       NULL,
  transaction_hashes TEXT      NULL
);

CREATE TABLE uncle
(
  hash              CHAR(66) PRIMARY KEY,
  index             INT       NOT NULL,
  nephew_hash       CHAR(66)  NOT NULL,
  number            NUMERIC   NOT NULL,
  height            NUMERIC   NOT NULL,
  parent_hash       CHAR(66)  NOT NULL,
  nonce             NUMERIC   NULL,
  sha3_uncles       CHAR(66)  NOT NULL,
  logs_bloom        CHAR(514) NOT NULL,
  transactions_root CHAR(66)  NOT NULL,
  state_root        CHAR(66)  NOT NULL,
  receipts_root     CHAR(66)  NOT NULL,
  author            CHAR(42)  NOT NULL,
  difficulty        NUMERIC   NOT NULL,
  total_difficulty  NUMERIC   NOT NULL,
  extra_data        TEXT      NULL,
  gas_limit         NUMERIC   NOT NULL,
  gas_used          NUMERIC   NOT NULL,
  timestamp         TIMESTAMP NOT NULL,
  size              BIGINT    NOT NULL
);

/* All transactions including possible transactions from old forks */
CREATE TABLE "transaction"
(
  hash              CHAR(66) PRIMARY KEY,
  nonce             NUMERIC   NOT NULL,
  block_hash        CHAR(66)  NOT NULL,
  block_number      NUMERIC   NOT NULL,
  transaction_index INT       NOT NULL,
  "from"            CHAR(42)  NOT NULL,
  "to"              CHAR(42)  NULL,
  value             NUMERIC   NOT NULL,
  gas_price         NUMERIC   NOT NULL,
  gas               NUMERIC   NOT NULL,
  input             BYTEA     NULL,
  v                 BIGINT    NOT NULL,
  r                 CHAR(78)  NOT NULL,
  s                 CHAR(78)  NOT NULL,
  timestamp         TIMESTAMP NOT NULL,
  creates           CHAR(42)  NULL,
  chain_id          BIGINT    NULL
);


/* This view helps to filter out non-canonical transactions based on the latest state of the canonical block header table */
CREATE VIEW canonical_transaction AS
SELECT t.*
FROM "transaction" AS t
       RIGHT JOIN canonical_block_header AS cb ON t.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND t.hash IS NOT NULL;

/* All receipts including possible receipts from old forks */
CREATE TABLE transaction_receipt
(
  transaction_hash    CHAR(66) PRIMARY KEY,
  transaction_index   INT          NOT NULL,
  block_hash          CHAR(66)     NOT NULL,
  block_number        NUMERIC      NOT NULL,
  "from"              CHAR(42)     NOT NULL,
  "to"                CHAR(42)     NULL,
  contract_address    CHAR(42)     NULL,
  cumulative_gas_used NUMERIC      NOT NULL,
  gas_used            NUMERIC      NOT NULL,
  logs                TEXT         NOT NULL,
  logs_bloom          CHAR(514)    NOT NULL,
  root                CHAR(66)     NULL,
  status              VARCHAR(128) NULL,
  timestamp           TIMESTAMP    NOT NULL
);


/* This view helps to filter out non canonical receipts based on the latest state of the canonical block header table */
CREATE VIEW canonical_transaction_receipt AS
SELECT tr.*
FROM transaction_receipt AS tr
       RIGHT JOIN canonical_block_header AS cb ON tr.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND tr.transaction_hash IS NOT NULL;

/* All traces including possible traces from old forks */
CREATE TABLE transaction_trace
(
  block_hash       CHAR(66)     NOT NULL,
  transaction_hash CHAR(66)     NULL,
  root_error       VARCHAR(514) NULL,
  timestamp        TIMESTAMP    NOT NULL,
  trace_count      INT          NOT NULL,
  traces           TEXT         NOT NULL,
  UNIQUE (block_hash, transaction_hash)
);


/* This view helps to filter out non canonical traces based on the latest state of the canonical block header table */
CREATE VIEW canonical_transaction_trace AS
SELECT tr.*
FROM transaction_trace AS tr
       RIGHT JOIN canonical_block_header AS cb ON tr.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND tr.transaction_hash IS NOT NULL;

CREATE TABLE contract
(
  address                              CHAR(42) PRIMARY KEY,
  creator                              CHAR(42)    NULL,
  init                                 TEXT        NULL,
  code                                 TEXT        NULL,
  contract_type                        VARCHAR(32) NULL,
  refund_address                       CHAR(66)    NULL,
  refund_balance                       NUMERIC     NULL,
  trace_created_at_block_hash          CHAR(66)    NULL,
  trace_created_at_block_number        NUMERIC     NULL,
  trace_created_at_transaction_hash    CHAR(66)    NULL,
  trace_created_at_transaction_index   INT         NULL,
  trace_created_at_log_index           INT         NULL,
  trace_created_at_trace_address       TEXT        NULL,
  trace_created_at_timestamp           TIMESTAMP   NOT NULL,
  trace_destroyed_at_block_hash        CHAR(66)    NULL,
  trace_destroyed_at_block_number      NUMERIC     NULL,
  trace_destroyed_at_transaction_hash  CHAR(66)    NULL,
  trace_destroyed_at_transaction_index INT         NULL,
  trace_destroyed_at_log_index         INT         NULL,
  trace_destroyed_at_trace_address     TEXT        NULL,
  trace_destroyed_at_timestamp         TIMESTAMP   NOT NULL,
  timestamp                            TIMESTAMP   NOT NULL
);


CREATE VIEW canonical_contract AS
SELECT c.*
FROM contract AS c
       RIGHT JOIN canonical_block_header AS cb ON c.trace_created_at_block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND c.address IS NOT NULL;

CREATE TABLE eth_list_contract_metadata
(
  address     CHAR(42) PRIMARY KEY,
  name        VARCHAR(128) NULL,
  symbol      VARCHAR(128) NULL,
  decimals    INT          NULL,
  ens_address VARCHAR(256) NULL,
  type        VARCHAR(32)  NULL,
  logo        TEXT         NULL,
  support     TEXT         NULL,
  social      TEXT         NULL,
  website     VARCHAR(256) NULL
);

CREATE TABLE fungible_balance
(
  address   CHAR(42)  NOT NULL,
  contract  CHAR(42)  NULL,
  amount    NUMERIC   NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (address, contract)
);

CREATE TABLE transaction_count
(
  address   CHAR(42) PRIMARY KEY,
  total_in  INT       NOT NULL,
  total_out INT       NOT NULL,
  timestamp TIMESTAMP NOT NULL
);

CREATE VIEW canonical_ether_balance AS
SELECT fb.address,
       fb.amount
FROM fungible_balance AS fb
WHERE contract = '';

CREATE VIEW canonical_erc20_balance AS
SELECT fb.contract,
       fb.address,
       fb.amount
FROM fungible_balance AS fb
       LEFT JOIN canonical_contract as c on fb.contract = c.address
WHERE fb.contract IS NOT NULL
  AND fb.contract != ''
  AND c.contract_type = 'ERC20';

CREATE TABLE fungible_balance_delta
(
  id                               BIGSERIAL,
  address                          CHAR(42)    NOT NULL,
  contract_address                 CHAR(42)    NULL,
  counterpart_address              CHAR(42)    NULL,
  token_type                       VARCHAR(32) NOT NULL,
  delta_type                       VARCHAR(32) NOT NULL,
  trace_location_block_hash        CHAR(66)    NULL,
  trace_location_block_number      NUMERIC     NULL,
  trace_location_transaction_hash  CHAR(66)    NULL,
  trace_location_transaction_index INT         NULL,
  trace_location_log_index         INT         NULL,
  trace_location_trace_address     TEXT        NULL,
  trace_location_timestamp         TIMESTAMP   NOT NULL,
  amount                           NUMERIC     NOT NULL
);


CREATE VIEW canonical_fungible_balance_delta AS
SELECT fbd.*
FROM fungible_balance_delta AS fbd
       RIGHT JOIN canonical_block_header AS cb ON fbd.trace_location_block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND fbd.address IS NOT NULL;

CREATE VIEW canonical_fungible_balance_transfer AS
SELECT fbd.id,
       fbd.counterpart_address      AS "from",
       fbd.address                  AS "to",
       fbd.contract_address,
       fbd.delta_type,
       fbd.token_type,
       fbd.amount,
       fbd.trace_location_block_hash,
       fbd.trace_location_block_number,
       fbd.trace_location_transaction_hash,
       fbd.trace_location_transaction_index,
       fbd.trace_location_log_index,
       fbd.trace_location_trace_address,
       fbd.trace_location_timestamp AS "timestamp"
FROM canonical_fungible_balance_delta AS fbd
       LEFT JOIN canonical_block_header AS bh ON fbd.trace_location_block_hash = bh.hash
WHERE bh.number IS NOT NULL
  AND fbd.amount > 0;

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

CREATE TABLE non_fungible_balance
(
  contract                         CHAR(42)  NOT NULL,
  token_id                         NUMERIC   NOT NULL,
  address                          CHAR(42)  NOT NULL,
  trace_location_block_hash        CHAR(66)  NULL,
  trace_location_block_number      NUMERIC   NULL,
  trace_location_transaction_hash  CHAR(66)  NULL,
  trace_location_transaction_index INT       NULL,
  trace_location_log_index         INT       NULL,
  trace_location_trace_address     TEXT      NULL,
  trace_location_timestamp         TIMESTAMP NOT NULL,
  PRIMARY KEY (contract, token_id)
);

CREATE VIEW canonical_erc721_balance AS
SELECT nfb.*
FROM non_fungible_balance AS nfb
       LEFT JOIN canonical_contract as c on nfb.contract = c.address
WHERE nfb.contract IS NOT NULL
  AND nfb.contract != ''
  AND c.contract_type = 'ERC20';

CREATE TABLE non_fungible_balance_delta
(
  id                               BIGSERIAL,
  contract                         CHAR(42)    NOT NULL,
  token_id                         NUMERIC     NOT NULL,
  token_type                       VARCHAR(32) NOT NULL,
  trace_location_block_hash        CHAR(66)    NULL,
  trace_location_block_number      NUMERIC     NULL,
  trace_location_transaction_hash  CHAR(66)    NULL,
  trace_location_transaction_index INT         NULL,
  trace_location_log_index         INT         NULL,
  trace_location_trace_address     TEXT        NULL,
  trace_location_timestamp         TIMESTAMP   NOT NULL,
  "from"                           CHAR(42)    NOT NULL,
  "to"                             CHAR(42)    NOT NULL
);


CREATE VIEW canonical_non_fungible_balance_delta AS
SELECT nfbd.*
FROM non_fungible_balance_delta AS nfbd
       RIGHT JOIN canonical_block_header AS cb ON nfbd.trace_location_block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND nfbd.contract IS NOT NULL;


CREATE TABLE erc20_metadata
(
  "address"      CHAR(42) PRIMARY KEY,
  "name"         VARCHAR(128) NULL,
  "symbol"       VARCHAR(128) NULL,
  "decimals"     INT          NULL,
  "total_supply" NUMERIC      NULL,
  "timestamp"    TIMESTAMP    NOT NULL
);


CREATE TABLE erc721_metadata
(
  "address"   CHAR(42) PRIMARY KEY,
  "name"      VARCHAR(128) NULL,
  "symbol"    VARCHAR(128) NULL,
  "timestamp" TIMESTAMP    NOT NULL
);


CREATE VIEW block_reward AS
SELECT address,
       trace_location_block_hash as block_hash,
       amount,
       delta_type
FROM fungible_balance_delta
WHERE delta_type IN ('BLOCK_REWARD', 'UNCLE_REWARD')
  AND amount > 0;

CREATE VIEW uncle_reward AS
SELECT address,
       trace_location_block_hash as block_hash,
       amount
FROM fungible_balance_delta
WHERE delta_type = 'UNCLE_REWARD'
  AND amount > 0;

CREATE VIEW canonical_block_reward AS
SELECT br.*
FROM block_reward AS br
       RIGHT JOIN canonical_block_header AS cb ON br.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND br.amount IS NOT NULL;

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
  u.hash IS NOT NULL AND
  cb.number IS NOT NULL AND
  fbd.delta_type = 'UNCLE_REWARD';



/* Token exchange rates table */
CREATE TABLE token_exchange_rates
(
  address                         CHAR(42) PRIMARY KEY,
  symbol                          VARCHAR(128) NULL,
  name                            VARCHAR(128) NULL,
  image                           TEXT         NULL,
  current_price                   NUMERIC      NULL,
  market_cap                      NUMERIC      NULL,
  market_cap_rank                 INT          NULL,
  total_volume                    NUMERIC      NULL,
  high24h                         NUMERIC      NULL,
  low24h                          NUMERIC      NULL,
  price_change24h                 NUMERIC      NULL,
  price_change_percentage24h      NUMERIC      NULL,
  market_cap_change24h            NUMERIC      NULL,
  market_cap_change_percentage24h NUMERIC      NULL,
  circulating_supply              NUMERIC      NULL,
  total_supply                    NUMERIC      NULL,
  last_updated                    BIGINT       NULL
);

CREATE VIEW canonical_token_exchange_rates AS
SELECT ter.*
FROM token_exchange_rates AS ter
       INNER JOIN canonical_contract AS cc on ter.address = cc.address;

/* Coin exchange rates table */
CREATE TABLE coin_exchange_rates
(
  id           VARCHAR(24) PRIMARY KEY,
  currency     CHAR(3) NOT NULL,
  price        NUMERIC NOT NULL,
  market_cap   NUMERIC NOT NULL,
  vol24h       NUMERIC NOT NULL,
  change24h    NUMERIC NOT NULL,
  last_updated BIGINT  NOT NULL
);

/* basic block metrics tables */

CREATE TABLE block_metrics_header
(
  block_hash       CHAR(66)  NOT NULL,
  number           NUMERIC   NOT NULL,
  timestamp        TIMESTAMP NOT NULL,
  block_time       INT       NULL,
  num_uncles       INT       NOT NULL,
  difficulty       NUMERIC   NOT NULL,
  total_difficulty NUMERIC   NOT NULL,
  UNIQUE (block_hash, timestamp)
);


CREATE TABLE block_metrics_transaction
(
  block_hash      CHAR(66)  NOT NULL,
  timestamp       TIMESTAMP NOT NULL,
  total_gas_price NUMERIC   NOT NULL,
  avg_gas_limit   NUMERIC   NOT NULL,
  avg_gas_price   NUMERIC   NOT NULL,
  UNIQUE (block_hash, timestamp)
);

CREATE TABLE block_metrics_transaction_trace
(
  block_hash         CHAR(66)  NOT NULL,
  timestamp          TIMESTAMP NOT NULL,
  total_txs          INT       NOT NULL,
  num_successful_txs INT       NOT NULL,
  num_failed_txs     INT       NOT NULL,
  num_internal_txs   INT       NOT NULL,
  UNIQUE (block_hash, timestamp)
);

CREATE TABLE block_metrics_transaction_fee
(
  block_hash    CHAR(66)  NOT NULL,
  timestamp     TIMESTAMP NOT NULL,
  total_tx_fees NUMERIC   NOT NULL,
  avg_tx_fees   NUMERIC   NOT NULL,
  UNIQUE (block_hash, timestamp)
);
