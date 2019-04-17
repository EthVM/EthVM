/* Canonical blocks table which is updated on fork */
CREATE TABLE canonical_block_header
(
  number            NUMERIC PRIMARY KEY,
  hash              CHAR(66)  NOT NULL UNIQUE,
  parent_hash       CHAR(66)  NOT NULL UNIQUE,
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
  timestamp         BIGINT    NOT NULL,
  size              BIGINT    NOT NULL,
  block_time        BIGINT    NULL
);

CREATE INDEX idx_block_header_number ON canonical_block_header (number DESC);
CREATE INDEX idx_block_header_hash ON canonical_block_header (hash);
CREATE INDEX idx_block_header_parent_hash ON canonical_block_header (parent_hash);
CREATE INDEX idx_block_header_author ON canonical_block_header (author);

/* A view to help with address metadata */
CREATE VIEW canonical_block_author AS
SELECT cb.author AS address,
       COUNT(*)  AS count
FROM canonical_block_header AS cb
GROUP BY cb.author
ORDER BY count DESC;

CREATE TABLE uncle
(
  hash              CHAR(66) PRIMARY KEY,
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
  timestamp         BIGINT    NOT NULL,
  size              BIGINT    NOT NULL
);

CREATE INDEX idx_uncle_nephew_hash ON uncle (nephew_hash);
CREATE INDEX idx_uncle_number ON uncle (number);
CREATE INDEX idx_uncle_height ON uncle (height);

CREATE VIEW canonical_uncle AS
SELECT cb.number as nephew_number,
       u.*
FROM uncle AS u
       RIGHT JOIN canonical_block_header AS cb ON u.nephew_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND u.hash IS NOT NULL
ORDER BY cb.number DESC;

/* All transactions including possible transactions from old forks */
CREATE TABLE "transaction"
(
  hash              CHAR(66) PRIMARY KEY,
  nonce             NUMERIC  NOT NULL,
  block_hash        CHAR(66) NOT NULL,
  block_number      NUMERIC  NOT NULL,
  transaction_index INT      NOT NULL,
  "from"            CHAR(42) NOT NULL,
  "to"              CHAR(42) NULL,
  value             NUMERIC  NOT NULL,
  gas_price         NUMERIC  NOT NULL,
  gas               NUMERIC  NOT NULL,
  input             BYTEA    NULL,
  v                 BIGINT   NOT NULL,
  r                 CHAR(78) NOT NULL,
  s                 CHAR(78) NOT NULL,
  timestamp         BIGINT   NOT NULL,
  creates           CHAR(42) NULL,
  chain_id          BIGINT   NULL,
  UNIQUE ("from", nonce)
);

CREATE INDEX idx_transaction_hash ON TRANSACTION (hash);
CREATE INDEX idx_transaction_block_hash ON TRANSACTION (block_hash);
CREATE INDEX idx_transaction_from ON TRANSACTION ("from");
CREATE INDEX idx_transaction_to ON TRANSACTION ("to");

/* This view helps to filter out non-canonical transactions based on the latest state of the canonical block header table */
CREATE VIEW canonical_transaction AS
SELECT t.*
FROM "transaction" AS t
       RIGHT JOIN canonical_block_header AS cb ON t.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND t.hash IS NOT NULL
ORDER BY cb.number DESC,
         t.transaction_index DESC;

/* All receipts including possible receipts from old forks */
CREATE TABLE transaction_receipt
(
  transaction_hash    CHAR(66) PRIMARY KEY,
  transaction_index   INT       NOT NULL,
  block_hash          CHAR(66)  NOT NULL,
  block_number        NUMERIC   NOT NULL,
  "from"              CHAR(42)  NOT NULL,
  "to"                CHAR(42)  NULL,
  contract_address    CHAR(42)  NULL,
  cumulative_gas_used NUMERIC   NOT NULL,
  gas_used            NUMERIC   NOT NULL,
  logs                TEXT      NOT NULL,
  logs_bloom          CHAR(514) NOT NULL,
  root                CHAR(66)  NULL,
  status              NUMERIC   NULL
);

CREATE INDEX idx_transaction_receipt_block_hash ON transaction_receipt (block_hash);
CREATE INDEX idx_transaction_receipt_from ON transaction_receipt ("from");
CREATE INDEX idx_transaction_receipt_to ON transaction_receipt ("to");
CREATE INDEX idx_transaction_receipt_from_to ON transaction_receipt ("from", "to");
CREATE INDEX idx_transaction_receipt_contract_address ON transaction_receipt ("contract_address");

/* This view helps to filter out non canonical receipts based on the latest state of the canonical block header table */
CREATE VIEW canonical_transaction_receipt AS
SELECT tr.*
FROM transaction_receipt AS tr
       RIGHT JOIN canonical_block_header AS cb ON tr.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND tr.transaction_hash IS NOT NULL
ORDER BY cb.number DESC,
         tr.transaction_index DESC;

/* All traces including possible traces from old forks */
CREATE TABLE transaction_trace
(
  block_hash           CHAR(66)     NOT NULL,
  transaction_hash     CHAR(66)     NULL,
  trace_address        TEXT         NOT NULL,
  transaction_position INT          NULL,
  block_number         NUMERIC      NOT NULL,
  subtraces            INT          NOT NULL,
  TYPE                 VARCHAR(66)  NOT NULL,
  error                VARCHAR(514) NULL,
  action               TEXT         NOT NULL,
  result               TEXT         NULL,
  UNIQUE (block_hash, transaction_hash, trace_address)
);

CREATE INDEX idx_transaction_trace_block_hash ON transaction_trace (block_hash);
CREATE INDEX idx_transaction_trace_transaction_hash ON transaction_trace (transaction_hash);

/* This view helps to filter out non canonical traces based on the latest state of the canonical block header table */
CREATE VIEW canonical_transaction_trace AS
SELECT tr.*
FROM transaction_trace AS tr
       RIGHT JOIN canonical_block_header AS cb ON tr.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND tr.transaction_hash IS NOT NULL
ORDER BY cb.number DESC,
         tr.transaction_position DESC;

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
  trace_created_at_trace_address       VARCHAR(64) NULL,
  trace_destroyed_at_block_hash        CHAR(66)    NULL,
  trace_destroyed_at_block_number      NUMERIC     NULL,
  trace_destroyed_at_transaction_hash  CHAR(66)    NULL,
  trace_destroyed_at_transaction_index INT         NULL,
  trace_destroyed_at_log_index         INT         NULL,
  trace_destroyed_at_trace_address     VARCHAR(64) NULL,
  trace_destroyed_at                   TEXT        NULL
);

CREATE INDEX idx_contract_creator ON contract (creator);
CREATE INDEX idx_contract_contract_type ON contract (contract_type);
CREATE INDEX idx_contract_trace_created_at_block_hash ON contract(trace_created_at_block_hash);

CREATE VIEW canonical_contract AS
    SELECT
      c.*
    FROM contract AS c
    RIGHT JOIN canonical_block_header AS cb ON c.trace_created_at_block_hash = cb.hash
    WHERE cb.number IS NOT NULL
      AND c.address IS NOT NULL
    ORDER BY cb.number DESC,
        c.trace_created_at_transaction_index DESC;

CREATE VIEW contract_creator AS
SELECT c.creator AS address,
       COUNT(*)  AS count
FROM contract AS c
GROUP BY c.creator
ORDER BY count DESC;

CREATE TABLE eth_list_contract_metadata
(
    address CHAR(42) PRIMARY KEY,
    name VARCHAR(64) NULL,
    symbol VARCHAR(64) NULL,
    decimals INT NULL,
    ens_address VARCHAR(256) NULL,
    type VARCHAR(32) NULL,
    logo TEXT NULL,
    support TEXT NULL,
    social TEXT NULL,
    website VARCHAR(256) NULL
);

CREATE TABLE fungible_balance
(
  address  CHAR(42) NOT NULL,
  contract CHAR(42) NULL,
  amount   NUMERIC  NOT NULL,
  PRIMARY KEY (address, contract)
);

CREATE INDEX idx_fungible_balance_contract ON fungible_balance (contract);

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
       LEFT JOIN contract as c on fb.contract = c.address
WHERE fb.contract IS NOT NULL
  AND fb.contract != ''
  AND c.contract_type = 'ERC20';

CREATE TABLE fungible_balance_deltas
(
  address                          CHAR(42)    NULL,
  contract_address                 CHAR(42)    NULL,
  token_type                       VARCHAR(32) NOT NULL,
  delta_type                       VARCHAR(32) NOT NULL,
  trace_location_block_hash        CHAR(66)    NULL,
  trace_location_block_number      NUMERIC     NULL,
  trace_location_transaction_hash  CHAR(66)    NULL,
  trace_location_transaction_index INT         NULL,
  trace_location_log_index         INT         NULL,
  trace_location_trace_address     VARCHAR(64) NULL,
  amount                           NUMERIC     NOT NULL
);

CREATE VIEW canonical_account AS
SELECT fb.address,
       fb.amount                    AS balance,
       (SELECT COUNT(*)
        FROM canonical_transaction AS ct
        WHERE ct.from = fb.address
           OR ct.to = fb.address)   AS total_tx_count,
       (SELECT COUNT(*)
        FROM canonical_transaction AS ct
        WHERE ct.to = fb.address)   AS in_tx_count,
       (SELECT COUNT(*)
        FROM canonical_transaction AS ct
        WHERE ct.from = fb.address) AS out_tx_count,
       CASE
         WHEN a.count > 0 THEN
           TRUE
         ELSE
           FALSE
         END                        AS is_miner,
       CASE
         WHEN cc.count > 0 THEN
           TRUE
         ELSE
           FALSE
         END                        AS is_contract_creator
FROM fungible_balance AS fb
       LEFT JOIN canonical_block_author AS a ON fb.address = a.address
       LEFT JOIN contract_creator AS cc ON fb.address = cc.address
WHERE fb.contract = ''
ORDER BY balance DESC;

CREATE INDEX idx_fungible_balance_deltas_address ON fungible_balance_deltas (address) WHERE address IS NOT NULL;
CREATE INDEX idx_fungible_balance_deltas_contract_address ON fungible_balance_deltas (contract_address);
CREATE INDEX idx_fungible_balance_deltas_token_type ON fungible_balance_deltas (token_type);
CREATE INDEX idx_fungible_balance_deltas_delta_type ON fungible_balance_deltas (delta_type);

CREATE TABLE non_fungible_balance
(
  contract                         CHAR(42)    NOT NULL,
  token_id                         NUMERIC     NOT NULL,
  address                          CHAR(42)    NOT NULL,
  trace_location_block_hash        CHAR(66)    NULL,
  trace_location_block_number      NUMERIC     NULL,
  trace_location_transaction_hash  CHAR(66)    NULL,
  trace_location_transaction_index INT         NULL,
  trace_location_log_index         INT         NULL,
  trace_location_trace_address     VARCHAR(64) NULL,
  PRIMARY KEY (contract, token_id)
);

CREATE INDEX idx_non_fungible_balance_address ON non_fungible_balance (address);
CREATE INDEX idx_non_fungible_balance_contract ON non_fungible_balance (contract);
CREATE INDEX idx_non_fungible_balance_contract_address ON non_fungible_balance (contract, address);

CREATE VIEW canonical_erc721_balance AS
SELECT *
FROM non_fungible_balance;

CREATE TABLE non_fungible_balance_deltas
(
  contract       CHAR(42)    NOT NULL,
  token_id       NUMERIC     NOT NULL,
  token_type     VARCHAR(32) NOT NULL,
  trace_location TEXT        NOT NULL,
  "from"         CHAR(42)    NOT NULL,
  "to"           CHAR(42)    NOT NULL
);

CREATE TABLE erc20_metadata
(
  "address"      CHAR(42) PRIMARY KEY,
  "name"         VARCHAR(64) NULL,
  "symbol"       VARCHAR(64) NULL,
  "decimals"     INT         NULL,
  "total_supply" NUMERIC     NULL
);

CREATE INDEX idx_erc20_metadata_name ON erc20_metadata (name);
CREATE INDEX idx_erc20_metadata_symbol ON erc20_metadata (symbol);

CREATE TABLE erc721_metadata
(
  "address"      CHAR(42) PRIMARY KEY,
  "name"         VARCHAR(64) NULL,
  "symbol"       VARCHAR(64) NULL
);

CREATE INDEX idx_erc721_metadata_name ON erc721_metadata (name);
CREATE INDEX idx_erc721_metadata_symbol ON erc721_metadata (symbol);

CREATE VIEW block_reward AS
SELECT
  fbd.trace_location_block_hash as hash,
  fbd.delta_type as delta_type,
  fbd.amount as amount
FROM fungible_balance_deltas AS fbd
WHERE
    delta_type IN ('BLOCK_REWARD', 'UNCLE_REWARD') AND
    amount > 0
ORDER BY trace_location_block_number DESC;

/* Token exchange rates table */
CREATE TABLE token_exchange_rates
(
  address                          CHAR(42)    PRIMARY KEY,
  symbol                           VARCHAR(64) NULL,
  name                             VARCHAR(64) NULL,
  image                            TEXT        NULL,
  current_price                    NUMERIC     NULL,
  market_cap                       NUMERIC     NULL,
  market_cap_rank                  INT         NULL,
  total_volume                     NUMERIC     NULL,
  high24h                          NUMERIC     NULL,
  low24h                           NUMERIC     NULL,
  price_change24h                  NUMERIC     NULL,
  price_change_percentage24h       NUMERIC     NULL,
  market_cap_change24h             NUMERIC     NULL,
  market_cap_change_percentage24h  NUMERIC     NULL,
  circulating_supply               VARCHAR(64) NULL,
  total_supply                     NUMERIC     NULL,
  last_updated                     TEXT        NULL
);

/* metrics hyper tables */
CREATE TABLE block_metrics_header
(
  block_number     NUMERIC  NOT NULL,
  block_hash       CHAR(66) NOT NULL,
  timestamp        BIGINT   NOT NULL,
  block_time       BIGINT   NULL,
  num_uncles       INT      NOT NULL,
  difficulty       NUMERIC  NOT NULL,
  total_difficulty NUMERIC  NOT NULL,
  UNIQUE (block_hash, timestamp)
);

CREATE TABLE block_metrics_transaction
(
  block_number    NUMERIC  NOT NULL,
  block_hash      CHAR(66) NOT NULL,
  timestamp       BIGINT   NOT NULL,
  total_gas_price NUMERIC  NOT NULL,
  avg_gas_limit   NUMERIC  NOT NULL,
  avg_gas_price   NUMERIC  NOT NULL,
  UNIQUE (block_hash, timestamp)
);

CREATE TABLE block_metrics_transaction_trace
(
  block_number       NUMERIC  NOT NULL,
  block_hash         CHAR(66) NOT NULL,
  timestamp          BIGINT   NOT NULL,
  total_txs          INT      NOT NULL,
  num_successful_txs INT      NOT NULL,
  num_failed_txs     INT      NOT NULL,
  num_internal_txs   INT      NOT NULL,
  UNIQUE (block_hash, timestamp)
);

CREATE TABLE block_metrics_transaction_fee
(
  block_number  NUMERIC  NOT NULL,
  block_hash    CHAR(66) NOT NULL,
  timestamp     BIGINT   NOT NULL,
  total_tx_fees NUMERIC  NOT NULL,
  avg_tx_fees   NUMERIC  NOT NULL,
  UNIQUE (block_hash, timestamp)
);

/* 1 day chunks */
SELECT create_hypertable('block_metrics_header',
                         'timestamp',
                         chunk_time_interval => 86400);

SELECT create_hypertable('block_metrics_transaction',
                         'timestamp',
                         chunk_time_interval => 86400);

SELECT create_hypertable('block_metrics_transaction_trace',
                         'timestamp',
                         chunk_time_interval => 86400);

SELECT create_hypertable('block_metrics_transaction_fee',
                         'timestamp',
                         chunk_time_interval => 86400);

/* useful views */
CREATE VIEW canonical_block_metrics_header_daily AS
SELECT time_bucket(86400, bmh.timestamp) AS daily,
       COUNT(*)                          AS count,
       MAX(bmh.difficulty)               AS max_difficulty,
       AVG(bmh.difficulty)               AS avg_difficulty,
       MIN(bmh.difficulty)               AS min_difficulty,
       SUM(bmh.difficulty)               AS sum_difficulty
FROM block_metrics_header AS bmh
       RIGHT JOIN canonical_block_header cbh ON bmh.block_hash = cbh.hash
WHERE cbh.number IS NOT NULL
  AND bmh.timestamp IS NOT NULL
GROUP BY daily
ORDER BY daily DESC;

CREATE VIEW canonical_block_metrics_header_hourly AS
SELECT time_bucket(
         3600,
         bmh.timestamp)  AS hour,
       COUNT(
         *)              AS count,
       MAX(
         bmh.difficulty) AS max_difficulty,
       AVG(
         bmh.difficulty) AS avg_difficulty,
       MIN(
         bmh.difficulty) AS min_difficulty,
       SUM(
         bmh.difficulty) AS sum_difficulty
FROM block_metrics_header AS bmh
       RIGHT JOIN canonical_block_header cbh ON bmh.block_hash = cbh.hash
WHERE cbh.number IS NOT NULL
  AND bmh.timestamp IS NOT NULL
GROUP BY hour
ORDER BY hour DESC;

CREATE VIEW canonical_block_metrics_transaction_fee_daily AS
SELECT time_bucket(
         86400,
         bmtf.timestamp)     AS daily,
       COUNT(
         *)                  AS count,
       MAX(
         bmtf.total_tx_fees) AS max_total_tx_fees,
       MIN(
         bmtf.total_tx_fees) AS min_total_tx_fees,
       AVG(
         bmtf.total_tx_fees) AS avg_total_tx_fees,
       SUM(
         bmtf.total_tx_fees) AS sum_total_tx_fees,
       MAX(
         bmtf.avg_tx_fees)   AS max_avg_tx_fees,
       MIN(
         bmtf.avg_tx_fees)   AS min_avg_tx_fees,
       AVG(
         bmtf.avg_tx_fees)   AS avg_avg_tx_fees,
       SUM(
         bmtf.avg_tx_fees)   AS sum_avg_tx_fees
FROM block_metrics_transaction_fee AS bmtf
       RIGHT JOIN canonical_block_header cbh ON bmtf.block_hash = cbh.hash
WHERE cbh.number IS NOT NULL
  AND bmtf.timestamp IS NOT NULL
GROUP BY daily
ORDER BY daily DESC;

CREATE VIEW canonical_block_metrics_transaction_fee_hourly AS
SELECT time_bucket(
         3600,
         bmtf.timestamp)     AS hourly,
       COUNT(
         *)                  AS count,
       MAX(
         bmtf.total_tx_fees) AS max_total_tx_fees,
       MIN(
         bmtf.total_tx_fees) AS min_total_tx_fees,
       AVG(
         bmtf.total_tx_fees) AS avg_total_tx_fees,
       SUM(
         bmtf.total_tx_fees) AS sum_total_tx_fees,
       MAX(
         bmtf.avg_tx_fees)   AS max_avg_tx_fees,
       MIN(
         bmtf.avg_tx_fees)   AS min_avg_tx_fees,
       AVG(
         bmtf.avg_tx_fees)   AS avg_avg_tx_fees,
       SUM(
         bmtf.avg_tx_fees)   AS sum_avg_tx_fees
FROM block_metrics_transaction_fee AS bmtf
       RIGHT JOIN canonical_block_header cbh ON bmtf.block_hash = cbh.hash
WHERE cbh.number IS NOT NULL
  AND bmtf.timestamp IS NOT NULL
GROUP BY hourly
ORDER BY hourly DESC;

CREATE VIEW canonical_block_metrics_transaction_daily AS
SELECT time_bucket(
         86400,
         bmt.timestamp)       AS daily,
       COUNT(*)               AS count,
       MAX(
         bmt.total_gas_price) AS max_total_gas_price,
       MIN(
         bmt.total_gas_price) AS min_total_gas_price,
       AVG(
         bmt.total_gas_price) AS avg_total_gas_price,
       SUM(
         bmt.total_gas_price) AS sum_total_gas_price,
       MAX(
         bmt.avg_gas_limit)   AS max_avg_gas_limit,
       MIN(
         bmt.avg_gas_limit)   AS min_avg_gas_limit,
       AVG(
         bmt.avg_gas_limit)   AS avg_avg_gas_limit,
       SUM(
         bmt.avg_gas_limit)   AS sum_avg_gas_limit,
       MAX(
         bmt.avg_gas_price)   AS max_avg_gas_price,
       MIN(
         bmt.avg_gas_price)   AS min_avg_gas_price,
       AVG(
         bmt.avg_gas_price)   AS avg_avg_gas_price,
       SUM(
         bmt.avg_gas_price)   AS sum_avg_gas_price
FROM block_metrics_transaction AS bmt
       RIGHT JOIN canonical_block_header cbh ON bmt.block_hash = cbh.hash
WHERE cbh.number IS NOT NULL
  AND bmt.timestamp IS NOT NULL
GROUP BY daily
ORDER BY daily DESC;

CREATE VIEW canonical_block_metrics_transaction_hourly AS
SELECT time_bucket(
         3600,
         bmt.timestamp)       AS hourly,
       COUNT(
         *)                   AS count,
       MAX(
         bmt.total_gas_price) AS max_total_gas_price,
       MIN(
         bmt.total_gas_price) AS min_total_gas_price,
       AVG(
         bmt.total_gas_price) AS avg_total_gas_price,
       SUM(
         bmt.total_gas_price) AS sum_total_gas_price,
       MAX(
         bmt.avg_gas_limit)   AS max_avg_gas_limit,
       MIN(
         bmt.avg_gas_limit)   AS min_avg_gas_limit,
       AVG(
         bmt.avg_gas_limit)   AS avg_avg_gas_limit,
       SUM(
         bmt.avg_gas_limit)   AS sum_avg_gas_limit,
       MAX(
         bmt.avg_gas_price)   AS max_avg_gas_price,
       MIN(
         bmt.avg_gas_price)   AS min_avg_gas_price,
       AVG(
         bmt.avg_gas_price)   AS avg_avg_gas_price,
       SUM(
         bmt.avg_gas_price)   AS sum_avg_gas_price
FROM block_metrics_transaction AS bmt
       RIGHT JOIN canonical_block_header cbh ON bmt.block_hash = cbh.hash
WHERE cbh.number IS NOT NULL
  AND bmt.timestamp IS NOT NULL
GROUP BY hourly
ORDER BY hourly DESC;

CREATE VIEW canonical_block_metrics_transaction_trace_daily AS
SELECT time_bucket(
         86400,
         bmtt.timestamp)          AS daily,
       COUNT(
         *)                       AS count,
       MAX(
         bmtt.total_txs)          AS max_total_txs,
       MIN(
         bmtt.total_txs)          AS min_total_txs,
       AVG(
         bmtt.total_txs)          AS avg_total_txs,
       SUM(
         bmtt.total_txs)          AS sum_total_txs,
       MAX(
         bmtt.num_successful_txs) AS max_num_successful_txs,
       MIN(
         bmtt.num_successful_txs) AS min_num_successful_txs,
       AVG(
         bmtt.num_successful_txs) AS avg_num_successful_txs,
       SUM(
         bmtt.num_successful_txs) AS sum_num_successful_txs,
       MAX(
         bmtt.num_failed_txs)     AS max_num_failed_txs,
       MIN(
         bmtt.num_failed_txs)     AS min_num_failed_txs,
       AVG(
         bmtt.num_failed_txs)     AS avg_num_failed_txs,
       SUM(
         bmtt.num_failed_txs)     AS sum_num_failed_txs,
       MAX(
         bmtt.num_internal_txs)   AS max_num_internal_txs,
       MIN(
         bmtt.num_internal_txs)   AS min_num_internal_txs,
       AVG(
         bmtt.num_internal_txs)   AS avg_num_internal_txs,
       SUM(
         bmtt.num_internal_txs)   AS sum_num_internal_txs
FROM block_metrics_transaction_trace AS bmtt
       RIGHT JOIN canonical_block_header cbh ON bmtt.block_hash = cbh.hash
WHERE cbh.number IS NOT NULL
  AND bmtt.timestamp IS NOT NULL
GROUP BY daily
ORDER BY daily DESC;

CREATE VIEW canonical_block_metrics_transaction_trace_hourly AS
SELECT time_bucket(
         86400,
         bmtt.timestamp)          AS hourly,
       COUNT(
         *)                       AS count,
       MAX(
         bmtt.total_txs)          AS max_total_txs,
       MIN(
         bmtt.total_txs)          AS min_total_txs,
       AVG(
         bmtt.total_txs)          AS avg_total_txs,
       SUM(
         bmtt.total_txs)          AS sum_total_txs,
       MAX(
         bmtt.num_successful_txs) AS max_num_successful_txs,
       MIN(
         bmtt.num_successful_txs) AS min_num_successful_txs,
       AVG(
         bmtt.num_successful_txs) AS avg_num_successful_txs,
       SUM(
         bmtt.num_successful_txs) AS sum_num_successful_txs,
       MAX(
         bmtt.num_failed_txs)     AS max_num_failed_txs,
       MIN(
         bmtt.num_failed_txs)     AS min_num_failed_txs,
       AVG(
         bmtt.num_failed_txs)     AS avg_num_failed_txs,
       SUM(
         bmtt.num_failed_txs)     AS sum_num_failed_txs,
       MAX(
         bmtt.num_internal_txs)   AS max_num_internal_txs,
       MIN(
         bmtt.num_internal_txs)   AS min_num_internal_txs,
       AVG(
         bmtt.num_internal_txs)   AS avg_num_internal_txs,
       SUM(
         bmtt.num_internal_txs)   AS sum_num_internal_txs
FROM block_metrics_transaction_trace AS bmtt
       RIGHT JOIN canonical_block_header cbh ON bmtt.block_hash = cbh.hash
WHERE cbh.number IS NOT NULL
  AND bmtt.timestamp IS NOT NULL
GROUP BY hourly
ORDER BY hourly DESC;

