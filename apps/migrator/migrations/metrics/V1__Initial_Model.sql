CREATE TABLE sync_status
(
    component       VARCHAR(128),
    block_number    DECIMAL   NOT NULL,
    timestamp       TIMESTAMP NOT NULL,
    block_timestamp TIMESTAMP NOT NULL,
    PRIMARY KEY (component)
);

CREATE TABLE sync_status_history
(
    component       VARCHAR(128),
    block_number    DECIMAL   NOT NULL,
    timestamp       TIMESTAMP NOT NULL,
    block_timestamp TIMESTAMP NOT NULL,
    PRIMARY KEY (component, block_number)
);

CREATE TABLE processor_hash_log
(
    processor_id VARCHAR(64),
    block_number DECIMAL  NOT NULL,
    block_hash   CHAR(66) NOT NULL,
    PRIMARY KEY (processor_id, block_number)
);

CREATE TABLE block_header
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
    block_time         INT       NULL DEFAULT 0,
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

CREATE TABLE transaction
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

/* All traces including possible traces from old forks */
CREATE TABLE trace
(
    block_number     NUMERIC      NOT NULL,
    block_hash       CHAR(66)     NOT NULL,
    transaction_hash CHAR(66)     NULL,
    root_error       VARCHAR(514) NULL,
    timestamp        TIMESTAMP    NOT NULL,
    trace_count      INT          NOT NULL,
    traces           TEXT         NOT NULL,
    UNIQUE (block_hash, transaction_hash)
);



CREATE TABLE contract
(
    address                       CHAR(42) PRIMARY KEY,
    creator                       CHAR(42)    NULL,
    init                          TEXT        NULL,
    code                          TEXT        NULL,
    contract_type                 VARCHAR(32) NULL,
    refund_address                CHAR(66)    NULL,
    refund_balance                NUMERIC     NULL,
    created_at_block_hash         CHAR(66)    NULL,
    created_at_block_number       NUMERIC     NULL,
    created_at_transaction_hash   CHAR(66)    NULL,
    created_at_trace_address      TEXT        NULL,
    created_at_timestamp          TIMESTAMP   NOT NULL,
    destroyed_at_block_hash       CHAR(66)    NULL,
    destroyed_at_block_number     NUMERIC     NULL,
    destroyed_at_transaction_hash CHAR(66)    NULL,
    destroyed_at_trace_address    TEXT        NULL,
    destroyed_at_timestamp        TIMESTAMP   NULL
);

CREATE TABLE contract_metadata
(
    address      CHAR(42) PRIMARY KEY,
    block_number NUMERIC      NOT NULL,
    name         VARCHAR(128) NULL,
    symbol       VARCHAR(128) NULL,
    decimals     INT          NULL,
    total_supply NUMERIC      NULL
);

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

CREATE TABLE token_exchange_rate
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

CREATE TABLE balance_delta
(
    id                  BIGSERIAL PRIMARY KEY,
    address             CHAR(42)    NOT NULL,
    contract_address    CHAR(42)    NULL,
    counterpart_address CHAR(42)    NULL,
    token_type          VARCHAR(32) NOT NULL,
    delta_type          VARCHAR(32) NOT NULL,
    amount              NUMERIC     NULL,
    token_id            NUMERIC     NULL,
    block_hash          CHAR(66)    NULL,
    block_number        NUMERIC     NULL,
    transaction_index   INT         NULL,
    transaction_hash    CHAR(66)    NULL,
    trace_address       TEXT        NULL,
    timestamp           TIMESTAMP   NOT NULL,
    is_receiving        BOOL        NOT NULL
);


CREATE TABLE balance
(
    id               BIGSERIAL PRIMARY KEY,
    address          CHAR(42)    NOT NULL,
    block_number     NUMERIC     NOT NULL,
    block_hash       CHAR(66)    NOT NULL,
    contract_address CHAR(42)    NULL,
    token_type       VARCHAR(32) NOT NULL,
    timestamp        TIMESTAMP   NOT NULL,
    balance          NUMERIC     NULL,
    token_id         NUMERIC     NULL
);

/* Utility to get around a type issue with jooq in kotlin when setting fields to null */

CREATE FUNCTION clear_contract_destroyed_fields(
    block_number NUMERIC
) RETURNS BOOLEAN
    LANGUAGE plpgsql AS
$$
BEGIN
    UPDATE contract
    SET destroyed_at_block_number     = NULL,
        destroyed_at_block_hash       = NULL,
        destroyed_at_transaction_hash = NULL,
        destroyed_at_trace_address    = NULL,
        destroyed_at_timestamp        = NULL
    WHERE contract.destroyed_at_block_number >= block_number;
    RETURN TRUE;
END;
$$;


CREATE TABLE canonical_count
(
    entity       VARCHAR(64),
    count        BIGINT  NOT NULL,
    block_number NUMERIC NOT NULL,
    PRIMARY KEY (entity, block_number)
);

CREATE TABLE address_transaction_count
(
    address      CHAR(42),
    total        BIGINT  NOT NULL,
    total_out    BIGINT  NOT NULL,
    total_in     BIGINT  NOT NULL,
    block_number NUMERIC NOT NULL,
    PRIMARY KEY (address, block_number)
);

CREATE TABLE address_transaction_count_delta
(
    id              BIGSERIAL PRIMARY KEY,
    address         CHAR(42),
    total_delta     INT     NOT NULL,
    total_out_delta INT     NOT NULL,
    total_in_delta  INT     NOT NULL,
    block_number    NUMERIC NOT NULL,
    UNIQUE (address, block_number)
);


CREATE TABLE miner_block_count
(
    author       CHAR(42),
    count        BIGINT  NOT NULL,
    block_number NUMERIC NOT NULL,
    PRIMARY KEY (author, block_number)
);


/* Coin exchange rates table */
CREATE TABLE coin_exchange_rate
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
    number           NUMERIC   NOT NULL,
    hash             CHAR(66)  NOT NULL,
    timestamp        TIMESTAMP NOT NULL,
    block_time       INT       NULL,
    num_uncles       INT       NOT NULL,
    difficulty       NUMERIC   NOT NULL,
    total_difficulty NUMERIC   NOT NULL,
    total_gas_price  NUMERIC   NOT NULL,
    avg_gas_limit    NUMERIC   NOT NULL,
    avg_gas_price    NUMERIC   NOT NULL,
    UNIQUE (number, timestamp)
);

CREATE TABLE block_metrics_trace
(
    number             NUMERIC   NOT NULL,
    hash               CHAR(66)  NOT NULL,
    timestamp          TIMESTAMP NOT NULL,
    total_txs          INT       NOT NULL,
    num_successful_txs INT       NOT NULL,
    num_failed_txs     INT       NOT NULL,
    num_internal_txs   INT       NOT NULL,
    total_tx_fees      NUMERIC   NOT NULL,
    avg_tx_fees        NUMERIC   NOT NULL,
    UNIQUE (number, timestamp)
);

/* 1 week chunks */

SELECT create_hypertable('block_metrics_header',
                         'timestamp',
                         chunk_time_interval => interval '1 week');

SELECT create_hypertable('block_metrics_trace',
                         'timestamp',
                         chunk_time_interval => interval '1 week');


CREATE VIEW block_metric AS
SELECT bh.number,
       bh.hash,
       bh.timestamp,
       bh.block_time,
       bh.num_uncles,
       bh.difficulty,
       bh.total_difficulty,
       bh.total_gas_price,
       bh.avg_gas_limit,
       bh.avg_gas_price,
       bmt.total_txs,
       bmt.num_successful_txs,
       bmt.num_failed_txs,
       bmt.num_internal_txs,
       bmt.total_tx_fees,
       bmt.avg_tx_fees
FROM block_metrics_header AS bh
         LEFT JOIN block_metrics_trace AS bmt ON bh.number = bmt.number;



CREATE TABLE address_internal_transaction_count
(
    address      CHAR(42),
    block_number NUMERIC NOT NULL,
    total        BIGINT  NOT NULL,
    total_out    BIGINT  NOT NULL,
    total_in     BIGINT  NOT NULL,
    PRIMARY KEY (address, block_number)
);

CREATE TABLE address_internal_transaction_count_delta
(
    id              BIGSERIAL PRIMARY KEY,
    address         CHAR(42),
    block_number    NUMERIC NOT NULL,
    total_delta     INT     NOT NULL,
    total_out_delta INT     NOT NULL,
    total_in_delta  INT     NOT NULL,
    UNIQUE (address, block_number)
);

CREATE TABLE address_contracts_created_count
(
    address      CHAR(42),
    block_number NUMERIC NOT NULL,
    count        BIGINT  NOT NULL,
    PRIMARY KEY (address, block_number)
);

CREATE TABLE address_contracts_created_count_delta
(
    id           BIGSERIAL PRIMARY KEY,
    address      CHAR(42),
    block_number NUMERIC NOT NULL,
    delta  INT     NOT NULL,
    UNIQUE (address, block_number)
);

CREATE TABLE address_token_count
(
    address      CHAR(42),
    token_type   VARCHAR(32),
    block_number NUMERIC,
    count        BIGINT NOT NULL,
    PRIMARY KEY (address, token_type, block_number)
);


CREATE TABLE address_token_count_delta
(
    id           BIGSERIAL PRIMARY KEY,
    address      CHAR(42)    NOT NULL,
    token_type   VARCHAR(32) NOT NULL,
    block_number NUMERIC     NOT NULL,
    delta        INT         NULL
);

CREATE TABLE contract_holder_count
(
    contract_address CHAR(42),
    block_number     NUMERIC,
    token_type   VARCHAR(32) NOT NULL,
    count            BIGINT  NOT NULL,
    PRIMARY KEY (contract_address, block_number, token_type)
);

CREATE TABLE contract_holder_count_delta
(
    id               BIGSERIAL PRIMARY KEY,
    contract_address CHAR(42) NOT NULL,
    token_type   VARCHAR(32) NOT NULL,
    block_number     NUMERIC NOT NULL,
    delta            INT  NOT NULL
);
