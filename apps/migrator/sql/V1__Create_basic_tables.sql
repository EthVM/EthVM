/* Count table to speed up count queries */

CREATE TABLE row_count
(
  relation VARCHAR(128) PRIMARY KEY,
  count   BIGINT
);

INSERT INTO row_count VALUES
  ('canonical_block_header', 0),
  ('transaction', 0),
  ('transaction_trace', 0),
  ('transaction_receipt', 0),
  ('uncle', 0);

CREATE OR REPLACE FUNCTION adjust_count()
  RETURNS TRIGGER AS
$$
DECLARE
BEGIN
  IF TG_OP = 'INSERT' THEN
    EXECUTE 'UPDATE row_count set count=count +1 where relation = ''' || TG_RELNAME || '''';
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    EXECUTE 'UPDATE row_count set count=count -1 where relation = ''' || TG_RELNAME || '''';
    RETURN OLD;
  END IF;
END;
$$
  LANGUAGE 'plpgsql';

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

CREATE INDEX idx_block_header_number ON canonical_block_header (number DESC);
CREATE INDEX idx_block_header_hash ON canonical_block_header (hash);
CREATE INDEX idx_block_header_parent_hash ON canonical_block_header (parent_hash);
CREATE INDEX idx_block_header_author ON canonical_block_header (author);

CREATE TRIGGER canonical_block_header_count
  BEFORE INSERT OR DELETE
  ON canonical_block_header
  FOR EACH ROW
EXECUTE PROCEDURE adjust_count();

/* A view to help with address metadata */

CREATE VIEW canonical_block_author AS
SELECT cb.author AS address,
       COUNT(*)  AS count
FROM canonical_block_header AS cb
GROUP BY cb.author
ORDER BY count DESC;

CREATE FUNCTION notify_canonical_block_header() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

  payload := json_build_object(
    'table', 'canonical_block_header',
    'action', TG_OP,
    'payload', json_build_object(
      'block_hash', record.hash,
      'number', record.number,
      'transaction_count', record.transaction_count,
      'uncle_count', record.uncle_count,
      'author', record.author
      )
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

CREATE TRIGGER notify_canonical_block_header
  AFTER INSERT OR UPDATE OR DELETE
  ON canonical_block_header
  FOR EACH ROW
EXECUTE PROCEDURE notify_canonical_block_header();

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

CREATE INDEX idx_uncle_nephew_hash ON uncle (nephew_hash);
CREATE INDEX idx_uncle_number ON uncle (number);
CREATE INDEX idx_uncle_height ON uncle (height);

CREATE TRIGGER uncle_count
  BEFORE INSERT OR DELETE
  ON uncle
  FOR EACH ROW
EXECUTE PROCEDURE adjust_count();


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

CREATE INDEX idx_transaction_hash ON TRANSACTION (hash);
CREATE INDEX idx_transaction_block_hash ON TRANSACTION (block_hash);
CREATE INDEX idx_transaction_from ON TRANSACTION ("from");
CREATE INDEX idx_transaction_to ON TRANSACTION ("to");

CREATE INDEX idx_transaction_transaction_index ON transaction (transaction_index DESC);
CREATE INDEX idx_transaction_block_number__transaction_index ON transaction (block_number DESC, transaction_index DESC);

CREATE TRIGGER transaction_count
  BEFORE INSERT OR DELETE
  ON transaction
  FOR EACH ROW
EXECUTE PROCEDURE adjust_count();


CREATE FUNCTION notify_transaction() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

  payload = json_build_object(
    'table', 'transaction',
    'action', TG_OP,
    'payload', json_build_object('transaction_hash', record.hash, 'block_hash', record.block_hash)
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

CREATE TRIGGER notify_transaction
  AFTER INSERT OR UPDATE OR DELETE
  ON "transaction"
  FOR EACH ROW
EXECUTE PROCEDURE notify_transaction();

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

CREATE INDEX idx_transaction_receipt_block_hash ON transaction_receipt (block_hash);
CREATE INDEX idx_transaction_receipt_from ON transaction_receipt ("from");
CREATE INDEX idx_transaction_receipt_to ON transaction_receipt ("to");
CREATE INDEX idx_transaction_receipt_from_to ON transaction_receipt ("from", "to");
CREATE INDEX idx_transaction_receipt_contract_address ON transaction_receipt ("contract_address");

CREATE TRIGGER transaction_receipt_count
  BEFORE INSERT OR DELETE
  ON transaction_receipt
  FOR EACH ROW
EXECUTE PROCEDURE adjust_count();


CREATE FUNCTION notify_transaction_receipt() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

  payload := json_build_object(
    'table', 'transaction_receipt',
    'action', TG_OP,
    'payload', json_build_object('block_hash', record.block_hash, 'transaction_hash', record.transaction_hash)
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

CREATE TRIGGER notify_transaction_receipt
  AFTER INSERT OR UPDATE OR DELETE
  ON "transaction_receipt"
  FOR EACH ROW
EXECUTE PROCEDURE notify_transaction_receipt();

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
  traces           TEXT         NOT NULL,
  UNIQUE (block_hash, transaction_hash)
);

CREATE INDEX idx_transaction_trace_block_hash ON transaction_trace (block_hash);
CREATE INDEX idx_transaction_trace_transaction_hash ON transaction_trace (transaction_hash);

CREATE TRIGGER transaction_trace_count
  BEFORE INSERT OR DELETE
  ON transaction_trace
  FOR EACH ROW
EXECUTE PROCEDURE adjust_count();


CREATE FUNCTION notify_transaction_trace() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

/* we only want notified about top level calls and rewards */

  IF (record.transaction_hash IS NULL) THEN
    /* block or uncle reward trace */

    payload := json_build_object(
      'table', 'transaction_trace',
      'action', TG_OP,
      'payload', json_build_object(
        'block_hash', record.block_hash
        )
      );

    PERFORM pg_notify('events', payload::text);

  ELSE
    /* root call trace */

    payload := json_build_object(
      'table', 'transaction_trace',
      'action', TG_OP,
      'payload', json_build_object(
        'block_hash', record.block_hash,
        'transaction_hash', record.transaction_hash,
        'root_error', record.root_error
        )
      );

    PERFORM pg_notify('events', payload::text);

  END IF;

  RETURN NULL;

END;
$body$ LANGUAGE plpgsql;

CREATE TRIGGER notify_transaction_trace
  AFTER INSERT OR UPDATE OR DELETE
  ON "transaction_trace"
  FOR EACH ROW
EXECUTE PROCEDURE notify_transaction_trace();

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

CREATE INDEX idx_contract_creator ON contract (creator);
CREATE INDEX idx_contract_contract_type ON contract (contract_type);
CREATE INDEX idx_contract_trace_created_at_block_hash ON contract (trace_created_at_block_hash);

CREATE TRIGGER contract_count
  BEFORE INSERT OR DELETE
  ON contract
  FOR EACH ROW
EXECUTE PROCEDURE adjust_count();


CREATE VIEW canonical_contract AS
SELECT c.*
FROM contract AS c
       RIGHT JOIN canonical_block_header AS cb ON c.trace_created_at_block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND c.address IS NOT NULL;

CREATE VIEW canonical_contract_creator AS
SELECT c.creator AS address,
       COUNT(*)  AS count
FROM canonical_contract AS c
GROUP BY c.creator;

CREATE TABLE eth_list_contract_metadata
(
  address     CHAR(42) PRIMARY KEY,
  name        VARCHAR(64)  NULL,
  symbol      VARCHAR(64)  NULL,
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

CREATE INDEX idx_fungible_balance_delta_address ON fungible_balance_delta (address);
CREATE INDEX idx_fungible_balance_delta_contract_address ON fungible_balance_delta (contract_address);
CREATE INDEX idx_fungible_balance_delta_counterpart_address ON fungible_balance_delta (counterpart_address);
CREATE INDEX idx_fungible_balance_delta_token_type ON fungible_balance_delta (token_type);
CREATE INDEX idx_fungible_balance_delta_delta_type ON fungible_balance_delta (token_type);
CREATE INDEX idx_fungible_balance_delta_trace_location_block_hash ON fungible_balance_delta (trace_location_block_hash);
CREATE INDEX idx_fungible_balance_delta_amount ON fungible_balance_delta (amount);

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
         WHEN cont.creator IS NULL THEN
           FALSE
         ELSE
           TRUE
         END                        AS is_contract,
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
       LEFT JOIN canonical_contract_creator AS cc ON fb.address = cc.address
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

CREATE INDEX idx_non_fungible_balance_address ON non_fungible_balance (address);
CREATE INDEX idx_non_fungible_balance_contract ON non_fungible_balance (contract);
CREATE INDEX idx_non_fungible_balance_contract_address ON non_fungible_balance (contract, address);

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

CREATE INDEX idx_non_fungible_balance_delta_contract ON non_fungible_balance_delta (contract);
CREATE INDEX idx_non_fungible_balance_delta_contract_token_id ON non_fungible_balance_delta (contract, token_id);
CREATE INDEX idx_non_fungible_balance_delta_from ON non_fungible_balance_delta ("from");
CREATE INDEX idx_non_fungible_balance_delta_to ON non_fungible_balance_delta ("to");
CREATE INDEX idx_non_fungible_balance_delta_from_to ON non_fungible_balance_delta ("from", "to");
CREATE INDEX idx_non_fungible_balance_delta_trace_location_block_hash ON non_fungible_balance_delta (trace_location_block_hash);

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
  "symbol"       VARCHAR(512) NULL,
  "decimals"     INT          NULL,
  "total_supply" NUMERIC      NULL
);

CREATE INDEX idx_erc20_metadata_name ON erc20_metadata (name);
CREATE INDEX idx_erc20_metadata_symbol ON erc20_metadata (symbol);

CREATE TABLE erc721_metadata
(
  "address" CHAR(42) PRIMARY KEY,
  "name"    VARCHAR(128) NULL,
  "symbol"  VARCHAR(512) NULL
);

CREATE INDEX idx_erc721_metadata_name ON erc721_metadata (name);
CREATE INDEX idx_erc721_metadata_symbol ON erc721_metadata (symbol);

CREATE VIEW block_reward AS
SELECT address,
       trace_location_block_hash as block_hash,
       delta_type,
       amount
FROM fungible_balance_delta
WHERE delta_type IN ('BLOCK_REWARD', 'UNCLE_REWARD')
  AND amount > 0;

CREATE VIEW canonical_block_reward AS
SELECT br.*
FROM block_reward AS br
       RIGHT JOIN canonical_block_header AS cb ON br.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND br.amount IS NOT NULL;

CREATE VIEW canonical_uncle AS
SELECT cb.number as nephew_number,
       u.*,
       br.amount AS reward_amount
FROM uncle AS u
       RIGHT JOIN canonical_block_header AS cb ON u.nephew_hash = cb.hash
       LEFT JOIN block_reward AS br ON u.nephew_hash = br.block_hash
WHERE cb.number IS NOT NULL
  AND u.hash IS NOT NULL
  AND br.delta_type = 'UNCLE_REWARD'
  AND u.author = br.address
ORDER BY cb.number DESC;

/* Token exchange rates table */
CREATE TABLE token_exchange_rates
(
  address                         CHAR(42) PRIMARY KEY,
  symbol                          VARCHAR(64) NULL,
  name                            VARCHAR(64) NULL,
  image                           TEXT        NULL,
  current_price                   NUMERIC     NULL,
  market_cap                      NUMERIC     NULL,
  market_cap_rank                 INT         NULL,
  total_volume                    NUMERIC     NULL,
  high24h                         NUMERIC     NULL,
  low24h                          NUMERIC     NULL,
  price_change24h                 NUMERIC     NULL,
  price_change_percentage24h      NUMERIC     NULL,
  market_cap_change24h            NUMERIC     NULL,
  market_cap_change_percentage24h NUMERIC     NULL,
  circulating_supply              NUMERIC     NULL,
  total_supply                    NUMERIC     NULL,
  last_updated                    BIGINT      NULL
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

CREATE INDEX idx_block_metrics_header_number ON block_metrics_header (number DESC);
CREATE INDEX idx_block_metrics_header_block_hash ON block_metrics_header (block_hash);

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

CREATE FUNCTION notify_block_metric() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

  payload := json_build_object(
    'table', TG_ARGV[0],
    'action', TG_OP,
    'payload', json_build_object(
      'block_hash', record.block_hash,
      'timestamp', record.timestamp
      )
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

CREATE TRIGGER notify_block_metrics_header
  AFTER INSERT OR UPDATE OR DELETE
  ON block_metrics_header
  FOR EACH ROW
EXECUTE PROCEDURE notify_block_metric('block_metrics_header');

CREATE TRIGGER notify_block_metrics_transaction
  AFTER INSERT OR UPDATE OR DELETE
  ON block_metrics_transaction
  FOR EACH ROW
EXECUTE PROCEDURE notify_block_metric('block_metrics_transaction');

CREATE TRIGGER notify_block_metrics_transaction_trace
  AFTER INSERT OR UPDATE OR DELETE
  ON block_metrics_transaction_trace
  FOR EACH ROW
EXECUTE PROCEDURE notify_block_metric('block_metrics_transaction_trace');

CREATE TRIGGER notify_block_metrics_transaction_fee
  AFTER INSERT OR UPDATE OR DELETE
  ON block_metrics_transaction_fee
  FOR EACH ROW
EXECUTE PROCEDURE notify_block_metric('block_metrics_transaction_fee');

/* 1 hour chunks */

SELECT create_hypertable('block_metrics_header',
                         'timestamp',
                         chunk_time_interval => interval '1 day');

SELECT create_hypertable('block_metrics_transaction',
                         'timestamp',
                         chunk_time_interval => interval '1 day');

SELECT create_hypertable('block_metrics_transaction_trace',
                         'timestamp',
                         chunk_time_interval => interval '1 day');

SELECT create_hypertable('block_metrics_transaction_fee',
                         'timestamp',
                         chunk_time_interval => interval '1 day');

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


/* */

CREATE TABLE kafka_offset_info
(
  consumer_group_id VARCHAR(256) NOT NULL,
  topic             VARCHAR(256) NOT NULL,
  timestamp         TIMESTAMP    NOT NULL,
  total_length      BIGINT       NOT NULL,
  total_offset      BIGINT       NOT NULL,
  PRIMARY KEY (consumer_group_id, topic)
);

CREATE TABLE kafka_offset_info_log
(
  timestamp         TIMESTAMP    NOT NULL,
  consumer_group_id VARCHAR(256) NOT NULL,
  topic             VARCHAR(256) NOT NULL,
  total_length      BIGINT       NOT NULL,
  total_offset      BIGINT       NOT NULL
);

SELECT create_hypertable('kafka_offset_info_log',
                         'timestamp',
                         chunk_time_interval => interval '1 hour');

CREATE VIEW kafka_offset_info_log_grafana AS
SELECT "timestamp",
       consumer_group_id,
       topic,
       CONCAT(consumer_group_id, ':', topic) AS consumer_group_and_topic,
       total_length,
       total_offset,
       (total_length - total_offset)         AS lag
FROM kafka_offset_info_log;
