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
  author            CHAR(66)  NOT NULL,
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

CREATE TABLE transaction
(
  hash              CHAR(66) PRIMARY KEY,
  nonce             NUMERIC  NOT NULL,
  block_hash        CHAR(66) NOT NULL,
  block_number      NUMERIC  NOT NULL,
  transaction_index INT      NOT NULL,
  "from"            CHAR(66) NOT NULL,
  "to"              CHAR(66) NULL,
  value             NUMERIC  NOT NULL,
  gas_price         NUMERIC  NOT NULL,
  gas               NUMERIC  NOT NULL,
  input             BYTEA    NULL,
  v                 BIGINT   NOT NULL,
  r                 CHAR(78) NOT NULL,
  s                 CHAR(78) NOT NULL,
  timestamp         BIGINT   NOT NULL,
  creates           CHAR(66) NULL,
  chain_id          BIGINT   NULL,
  UNIQUE ("from", nonce)
);

CREATE INDEX idx_transaction_hash ON transaction (hash);
CREATE INDEX idx_transaction_block_hash ON transaction (block_hash);
CREATE INDEX idx_transaction_from ON transaction ("from");
CREATE INDEX idx_transaction_to ON transaction ("to");

CREATE TABLE transaction_receipt
(
  transaction_hash    CHAR(66) PRIMARY KEY,
  transaction_index   INT       NOT NULL,
  block_hash          CHAR(66)  NOT NULL,
  block_number        NUMERIC   NOT NULL,
  "from"              CHAR(66)  NOT NULL,
  "to"                CHAR(66)  NULL,
  contract_address    CHAR(66)  NULL,
  cumulative_gas_used NUMERIC   NOT NULL,
  gas_used            NUMERIC   NOT NULL,
  logs                TEXT NOT NULL,
  logs_bloom          CHAR(514) NOT NULL,
  root                CHAR(66)  NULL,
  status              NUMERIC   NULL
);

CREATE TABLE receipt_log
(
  transaction_hash CHAR(66)      NOT NULL,
  log_index        INT           NOT NULL,
  address          CHAR(66)      NOT NULL,
  data             TEXT          NOT NULL,
  topics           TEXT NOT NULL /* json encode array of strings */,
  PRIMARY KEY (transaction_hash, log_index)
);

CREATE TABLE transaction_trace
(
  transaction_hash  CHAR(66),
  transaction_position INT           NOT NULL,
  block_hash        CHAR(66)      NOT NULL,
  block_number      NUMERIC       NOT NULL,
  trace_address     TEXT NOT NULL,
  subtraces         INT           NOT NULL,
  type              VARCHAR(66)   NOT NULL,
  error             VARCHAR(514)  NULL,
  action            TEXT NOT NULL,
  result            TEXT NULL,
  PRIMARY KEY (transaction_hash, trace_address)
);

CREATE TABLE contract
(
  address        CHAR(66) PRIMARY KEY,
  creator        CHAR(66)      NULL,
  init           TEXT          NULL,
  code           TEXT          NULL,
  refund_address CHAR(66)      NULL,
  refund_balance NUMERIC       NULL,
  metadata       TEXT NULL,
  created_at     TEXT NULL,
  destroyed_at   TEXT NULL
);

CREATE TABLE address
(
  address CHAR(66) PRIMARY KEY,
  miner   BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE fungible_balance
(
  address  CHAR(66) REFERENCES address (address),
  contract CHAR(66) NULL,
  amount   NUMERIC  NOT NULL,
  PRIMARY KEY (address, contract)
);

CREATE TABLE non_fungible_balance
(
  contract CHAR(66) NOT NULL,
  token_id NUMERIC  NOT NULL,
  address  CHAR(66) NOT NULL REFERENCES address (address),
  PRIMARY KEY (contract, token_id)
);


CREATE TABLE block_metric
(
  block_number       NUMERIC,
  timestamp          TIMESTAMP NULL,
  hash               CHAR(66)  NULL,
  num_total_txs      INT       NULL,
  num_successful_txs INT       NULL,
  num_failed_txs     INT       NULL,
  num_internal_txs   INT       NULL,
  num_uncles         INT       NULL,
  difficulty         NUMERIC,
  total_difficulty   NUMERIC,
  total_gas_price    NUMERIC,
  avg_gas_limit      NUMERIC,
  avg_gas_price      NUMERIC,
  total_tx_fees      NUMERIC,
  avg_tx_fees        NUMERIC
);

SELECT create_hypertable('block_metric', 'timestamp');
