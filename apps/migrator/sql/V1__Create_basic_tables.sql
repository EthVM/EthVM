CREATE TABLE block_header
(

  number            BIGINT PRIMARY KEY,
  hash              CHAR(32)    NOT NULL UNIQUE,
  parent_hash       CHAR(32)    NOT NULL UNIQUE,
  nonce             NUMERIC(78) NULL,
  sha3_uncles       CHAR(32)    NOT NULL,
  logs_bloom        CHAR(256)   NOT NULL,
  transactions_root CHAR(32)    NOT NULL,
  state_root        CHAR(32)    NOT NULL,
  receipts_root     CHAR(32)    NOT NULL,
  author            CHAR(32)    NOT NULL,
  difficulty        NUMERIC(78) NOT NULL,
  total_difficulty  NUMERIC(78) NOT NULL,
  extra_data        TEXT        NULL,
  gasLimit          NUMERIC(78) NOT NULL,
  gasUsed           NUMERIC(78) NOT NULL,
  timestamp         BIGINT      NOT NULL,
  size              BIGINT      NOT NULL

);

CREATE TABLE uncle
(

  number            BIGINT PRIMARY KEY,
  nephew_number     BIGINT      NOT NULL REFERENCES block_header (number) ON DELETE CASCADE,
  hash              CHAR(32)    NOT NULL UNIQUE,
  parent_hash       CHAR(32)    NOT NULL UNIQUE,
  nonce             NUMERIC(78) NULL,
  sha3_uncles       CHAR(32)    NOT NULL,
  logs_bloom        CHAR(256)   NOT NULL,
  transactions_root CHAR(32)    NOT NULL,
  state_root        CHAR(32)    NOT NULL,
  receipts_root     CHAR(32)    NOT NULL,
  author            CHAR(32)    NOT NULL,
  difficulty        NUMERIC(78) NOT NULL,
  total_difficulty  NUMERIC(78) NOT NULL,
  extra_data        TEXT        NULL,
  gasLimit          NUMERIC(78) NOT NULL,
  gasUsed           NUMERIC(78) NOT NULL,
  timestamp         BIGINT      NOT NULL,
  size              BIGINT      NOT NULL

);

CREATE TABLE transaction
(
  hash              CHAR(32) PRIMARY KEY,
  nonce             NUMERIC(78) NOT NULL,
  block_hash        CHAR(32)    NOT NULL REFERENCES block_header (hash) ON DELETE CASCADE,
  block_number      NUMERIC(78) NOT NULL,
  transaction_index INT         NOT NULL,
  "from"            CHAR(32)    NOT NULL,
  "to"              CHAR(32)    NULL,
  value             NUMERIC(78) NOT NULL,
  gas_price         NUMERIC(78) NOT NULL,
  gas               NUMERIC(78) NOT NULL,
  input             BYTEA       NULL,
  v                 BIGINT      NOT NULL,
  r                 NUMERIC(78) NOT NULL,
  s                 NUMERIC(78) NOT NULL,
  timestamp         BIGINT      NOT NULL,
  creates           CHAR(32)    NULL,
  chain_id          BIGINT      NULL
);

CREATE TABLE transaction_receipt
(
  transaction_hash    CHAR(32) PRIMARY KEY REFERENCES transaction (hash) ON DELETE CASCADE,
  transaction_index   INT         NOT NULL,
  block_hash          CHAR(32)    NOT NULL,
  block_number        NUMERIC(78) NOT NULL,
  "from"              CHAR(32)    NOT NULL,
  "to"                CHAR(32)    NULL,
  contract_address    CHAR(32)    NULL,
  cumulative_gas_used NUMERIC(78) NOT NULL,
  gas_used            NUMERIC(78) NOT NULL,
  logs_bloom          CHAR(256)   NOT NULL,
  root                CHAR(32)    NULL,
  status              NUMERIC(78) NULL
);

CREATE TABLE receipt_log
(
  transaction_hash CHAR(32) NOT NULL REFERENCES transaction_receipt (transaction_hash) ON DELETE CASCADE,
  log_index        INT      NOT NULL,
  address          CHAR(32) NOT NULL,
  data             TEXT     NOT NULL,
  topics           JSONB    NOT NULL /* json encode array of strings */,
  PRIMARY KEY (transaction_hash, log_index)
);

CREATE TABLE transaction_trace
(
  transaction_hash  CHAR(32) REFERENCES transaction (hash) ON DELETE CASCADE,
  transaction_index INT          NOT NULL,
  block_hash        CHAR(32)     NOT NULL,
  block_number      NUMERIC(78)  NOT NULL,
  trace_address     JSONB        NOT NULL,
  subtraces         INT          NOT NULL,
  type              VARCHAR(32)  NOT NULL,
  error             VARCHAR(256) NULL,
  action            JSONB        NOT NULL,
  result            JSONB        NULL,
  PRIMARY KEY (transaction_hash, trace_address)
);

CREATE TABLE contract
(
  address        CHAR(32) PRIMARY KEY,
  creator        CHAR(32)    NULL,
  init           TEXT        NULL,
  code           TEXT        NULL,
  refund_address CHAR(32)    NULL,
  refund_balance NUMERIC(78) NULL,
  metadata       JSONB       NULL,
  created_at     JSONB       NULL,
  destroyed_at   JSONB       NULL
);

CREATE TABLE address
(
  address CHAR(32) PRIMARY KEY,
  miner   BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE fungible_balance
(
  address  CHAR(32) REFERENCES address (address),
  contract CHAR(32)    NULL,
  amount   NUMERIC(78) NOT NULL,
  PRIMARY KEY (address, contract)
);

CREATE TABLE non_fungible_balance
(
  contract CHAR(32)    NOT NULL,
  token_id NUMERIC(78) NOT NULL,
  address  CHAR(32)    NOT NULL REFERENCES address (address),
  PRIMARY KEY (contract, token_id)
);


CREATE TABLE block_metric
(
  block_number       NUMERIC(78),
  timestamp          TIMESTAMP NULL,
  hash               CHAR(32) NULL,
  num_total_txs      INT      NULL,
  num_successful_txs INT      NULL,
  num_failed_txs     INT      NULL,
  num_internal_txs   INT      NULL,
  num_uncles         INT      NULL,
  difficulty         NUMERIC(78),
  total_difficulty   NUMERIC(78),
  total_gas_price    NUMERIC(78),
  avg_gas_limit      NUMERIC(78),
  avg_gas_price      NUMERIC(78),
  total_tx_fees      NUMERIC(78),
  avg_tx_fees        NUMERIC(78)
);

SELECT create_hypertable('block_metric', 'timestamp');
