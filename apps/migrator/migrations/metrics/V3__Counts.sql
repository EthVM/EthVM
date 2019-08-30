CREATE TABLE address_internal_transaction_count
(
    address      CHAR(42),
    total        BIGINT  NOT NULL,
    total_out    BIGINT  NOT NULL,
    total_in     BIGINT  NOT NULL,
    block_number NUMERIC NOT NULL,
    PRIMARY KEY (address, block_number)
);

CREATE TABLE address_internal_transaction_count_delta
(
    id              BIGSERIAL PRIMARY KEY,
    address         CHAR(42),
    total_delta     BIGINT  NOT NULL,
    total_out_delta BIGINT  NOT NULL,
    total_in_delta  BIGINT  NOT NULL,
    block_number    NUMERIC NOT NULL,
    UNIQUE (address, block_number)
);

CREATE TABLE address_contracts_created_count
(
    address      CHAR(42),
    total        BIGINT  NOT NULL,
    block_number NUMERIC NOT NULL,
    PRIMARY KEY (address, block_number)
);

CREATE TABLE address_contracts_created_count_delta
(
    id              BIGSERIAL PRIMARY KEY,
    address         CHAR(42),
    total_delta     BIGINT  NOT NULL,
    block_number    NUMERIC NOT NULL,
    UNIQUE (address, block_number)
);
