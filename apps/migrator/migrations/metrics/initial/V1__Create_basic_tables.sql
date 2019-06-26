
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


/* 1 hour chunks */

SELECT create_hypertable('block_metrics_header',
                         'timestamp',
                         chunk_time_interval => interval '1 week');

SELECT create_hypertable('block_metrics_transaction',
                         'timestamp',
                         chunk_time_interval => interval '1 week');

SELECT create_hypertable('block_metrics_transaction_trace',
                         'timestamp',
                         chunk_time_interval => interval '1 week');

SELECT create_hypertable('block_metrics_transaction_fee',
                         'timestamp',
                         chunk_time_interval => interval '1 week');

CREATE VIEW canonical_block_metrics_header AS
SELECT cbh.number,
       cbh.hash AS block_hash,
       bmh.timestamp,
       bmh.block_time,
       bmh.num_uncles,
       bmh.difficulty,
       bmh.total_difficulty
FROM canonical_block_header AS cbh
       LEFT JOIN block_metrics_header AS bmh ON cbh.hash = bmh.block_hash;

CREATE VIEW canonical_block_metrics_transaction AS
SELECT cbh.number,
       cbh.hash                         AS block_hash,
       bmt.timestamp,
       COALESCE(bmt.avg_gas_price, 0)   AS avg_gas_price,
       COALESCE(bmt.total_gas_price, 0) AS total_gas_price,
       COALESCE(bmt.avg_gas_limit, 0)   AS avg_gas_limit
FROM canonical_block_header AS cbh
       LEFT JOIN block_metrics_transaction AS bmt ON cbh.hash = bmt.block_hash;

CREATE VIEW canonical_block_metrics_transaction_trace AS
SELECT cbh.number,
       cbh.hash                             AS block_hash,
       bmtt.timestamp,
       COALESCE(bmtt.num_internal_txs, 0)   AS num_internal_txs,
       COALESCE(bmtt.num_failed_txs, 0)     AS num_failed_txs,
       COALESCE(bmtt.num_successful_txs, 0) AS num_successful_txs,
       COALESCE(bmtt.total_txs, 0)          AS total_txs
FROM canonical_block_header AS cbh
       LEFT JOIN block_metrics_transaction_trace AS bmtt ON cbh.hash = bmtt.block_hash;

CREATE VIEW canonical_block_metrics_transaction_fee AS
SELECT cbh.number,
       cbh.hash                        AS block_hash,
       bmtf.timestamp,
       COALESCE(bmtf.avg_tx_fees, 0)   AS avg_tx_fees,
       COALESCE(bmtf.total_tx_fees, 0) AS total_tx_fees
FROM canonical_block_header AS cbh
       LEFT JOIN block_metrics_transaction_fee AS bmtf ON cbh.hash = bmtf.block_hash;


CREATE VIEW canonical_block_metric AS
SELECT bh.number,
       bh.block_hash,
       bh.timestamp,
       bh.block_time,
       bh.num_uncles,
       bh.difficulty,
       bh.total_difficulty,
       bt.total_gas_price,
       bt.avg_gas_limit,
       bt.avg_gas_price,
       btt.total_txs,
       btt.num_successful_txs,
       btt.num_failed_txs,
       btt.num_internal_txs,
       btf.total_tx_fees,
       btf.avg_tx_fees
FROM block_metrics_header AS bh
       RIGHT JOIN canonical_block_header cb ON bh.block_hash = cb.hash
       LEFT JOIN block_metrics_transaction AS bt ON bh.block_hash = bt.block_hash
       LEFT JOIN block_metrics_transaction_trace AS btt ON bh.block_hash = btt.block_hash
       LEFT JOIN block_metrics_transaction_fee AS btf ON bh.block_hash = btf.block_hash
WHERE cb.number IS NOT NULL
  AND bh.number IS NOT NULL;


/* */

CREATE TABLE parity_sync_state
(
  source    VARCHAR(64) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  head      NUMERIC   NOT NULL,
  number    NUMERIC   NOT NULL
);

CREATE TABLE parity_sync_state_log
(
  source    VARCHAR(64) NOT NULL,
  timestamp TIMESTAMP   NOT NULL,
  head      NUMERIC     NOT NULL,
  number    NUMERIC     NOT NULL
);

CREATE VIEW parity_sync_state_log_grafana AS
SELECT source,
       "timestamp",
       head,
       number,
       (head - number) as lag
FROM parity_sync_state_log;
