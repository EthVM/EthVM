CREATE TABLE canonical_block_header
(
  number            NUMERIC(78) PRIMARY KEY,
  hash              CHAR(66)    NOT NULL UNIQUE,
  parent_hash       CHAR(66)    NOT NULL UNIQUE,
  nonce             NUMERIC(78) NULL,
  sha3_uncles       CHAR(66)    NOT NULL,
  logs_bloom        CHAR(514)   NOT NULL,
  transactions_root CHAR(66)    NOT NULL,
  state_root        CHAR(66)    NOT NULL,
  receipts_root     CHAR(66)    NOT NULL,
  author            CHAR(66)    NOT NULL,
  difficulty        NUMERIC(78) NOT NULL,
  total_difficulty  NUMERIC(78) NOT NULL,
  extra_data        TEXT        NULL,
  gas_limit         NUMERIC(78) NOT NULL,
  gas_used          NUMERIC(78) NOT NULL,
  timestamp         BIGINT      NOT NULL,
  size              BIGINT      NOT NULL,
  block_time        BIGINT      NOT NULL
);

CREATE INDEX idx_block_header_number ON canonical_block_header (number DESC);
CREATE INDEX idx_block_header_hash ON canonical_block_header (hash);
CREATE INDEX idx_block_header_parent_hash ON canonical_block_header (parent_hash);
CREATE INDEX idx_block_header_author ON canonical_block_header (author);

CREATE TABLE transaction
(
  hash              CHAR(66) PRIMARY KEY,
  nonce             CHAR(80) NOT NULL,
  block_hash        CHAR(66) NOT NULL,
  block_number      CHAR(80) NOT NULL,
  transaction_index INT      NOT NULL,
  "from"            CHAR(66) NOT NULL,
  "to"              CHAR(66) NULL,
  value             CHAR(80) NOT NULL,
  gas_price         CHAR(80) NOT NULL,
  gas               CHAR(80) NOT NULL,
  input             BYTEA    NULL,
  v                 BIGINT   NOT NULL,
  r                 CHAR(78) NOT NULL,
  s                 CHAR(78) NOT NULL,
  timestamp         BIGINT   NOT NULL,
  creates           CHAR(66) NULL,
  chain_id          BIGINT   NULL
);

CREATE INDEX idx_transaction_hash_nonce ON transaction (hash, nonce);
CREATE INDEX idx_transaction_block_hash ON transaction (block_hash);
CREATE INDEX idx_transaction_from ON transaction ("from");
CREATE INDEX idx_transaction_to ON transaction ("to");

CREATE TABLE transaction_receipt
(
  transactionHash   CHAR(66) PRIMARY KEY,
  transactionIndex  INT       NOT NULL,
  blockHash         CHAR(66)  NOT NULL,
  blockNumber       CHAR(80)  NOT NULL,
  "from"            CHAR(66)  NOT NULL,
  "to"              CHAR(66)  NULL,
  contractAddress   CHAR(66)  NULL,
  cumulativeGasUsed CHAR(80)  NOT NULL,
  gasUsed           CHAR(80)  NOT NULL,
  logsBloom         CHAR(514) NOT NULL,
  root              CHAR(66)  NULL,
  status            CHAR(80)  NULL
);

CREATE TABLE receipt_log
(
  transaction_hash CHAR(66) NOT NULL,
  log_index        INT      NOT NULL,
  address          CHAR(66) NOT NULL,
  data             TEXT     NOT NULL,
  topics           JSONB    NOT NULL /* json encode array of strings */,
  PRIMARY KEY (transaction_hash, log_index)
);

CREATE TABLE transaction_trace
(
  transaction_hash  CHAR(66),
  transaction_index INT          NOT NULL,
  block_hash        CHAR(66)     NOT NULL,
  block_number      CHAR(80)     NOT NULL,
  trace_address     JSONB        NOT NULL,
  subtraces         INT          NOT NULL,
  type              VARCHAR(66)  NOT NULL,
  error             VARCHAR(514) NULL,
  action            JSONB        NOT NULL,
  result            JSONB        NULL,
  PRIMARY KEY (transaction_hash, trace_address)
);

CREATE TABLE contract
(
  address        CHAR(66) PRIMARY KEY,
  creator        CHAR(66) NULL,
  init           TEXT     NULL,
  code           TEXT     NULL,
  refund_address CHAR(66) NULL,
  refund_balance CHAR(80) NULL,
  metadata       JSONB    NULL,
  created_at     JSONB    NULL,
  destroyed_at   JSONB    NULL
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
  amount   CHAR(80) NOT NULL,
  PRIMARY KEY (address, contract)
);

CREATE TABLE non_fungible_balance
(
  contract CHAR(66) NOT NULL,
  token_id CHAR(80) NOT NULL,
  address  CHAR(66) NOT NULL REFERENCES address (address),
  PRIMARY KEY (contract, token_id)
);


CREATE TABLE block_metric
(
  block_number       CHAR(80),
  timestamp          TIMESTAMP NULL,
  hash               CHAR(66)  NULL,
  num_total_txs      INT       NULL,
  num_successful_txs INT       NULL,
  num_failed_txs     INT       NULL,
  num_internal_txs   INT       NULL,
  num_uncles         INT       NULL,
  difficulty         CHAR(80),
  total_difficulty   CHAR(80),
  total_gas_price    CHAR(80),
  avg_gas_limit      CHAR(80),
  avg_gas_price      CHAR(80),
  total_tx_fees      CHAR(80),
  avg_tx_fees        CHAR(80)
);

SELECT create_hypertable('block_metric', 'timestamp');
