/* Drop old indexes */
DROP INDEX IF EXISTS idx_block_header_number;
DROP INDEX IF EXISTS idx_block_header_hash;
DROP INDEX IF EXISTS idx_block_header_parent_hash;
DROP INDEX IF EXISTS idx_block_header_author;
DROP INDEX IF EXISTS idx_uncle_hash;
DROP INDEX IF EXISTS idx_uncle_author;
DROP INDEX IF EXISTS idx_uncle_nephew_hash;
DROP INDEX IF EXISTS idx_uncle_number;
DROP INDEX IF EXISTS idx_uncle_height;
DROP INDEX IF EXISTS idx_transaction_hash;
DROP INDEX IF EXISTS idx_transaction_block_hash;
DROP INDEX IF EXISTS idx_transaction_from;
DROP INDEX IF EXISTS idx_transaction_to;
DROP INDEX IF EXISTS idx_transaction_transaction_index;
DROP INDEX IF EXISTS idx_transaction_block_number;
DROP INDEX IF EXISTS idx_transaction_block_number__transaction_index;
DROP INDEX IF EXISTS idx_transaction_receipt_block_hash;
DROP INDEX IF EXISTS idx_transaction_receipt_from;
DROP INDEX IF EXISTS idx_transaction_receipt_to;
DROP INDEX IF EXISTS idx_transaction_receipt_from_to;
DROP INDEX IF EXISTS idx_transaction_receipt_contract_address;
DROP INDEX IF EXISTS idx_transaction_trace_block_hash;
DROP INDEX IF EXISTS idx_transaction_trace_transaction_hash;
DROP INDEX IF EXISTS idx_fungible_balance_delta_address;
DROP INDEX IF EXISTS idx_fungible_balance_delta_contract_address;
DROP INDEX IF EXISTS idx_fungible_balance_delta_delta_type__contract_address;
DROP INDEX IF EXISTS idx_fungible_balance_delta_counterpart_address;
DROP INDEX IF EXISTS idx_fungible_balance_delta_token_type;
DROP INDEX IF EXISTS idx_fungible_balance_delta_delta_type;
DROP INDEX IF EXISTS idx_fungible_balance_delta_tl_block_hash;
DROP INDEX IF EXISTS idx_fungible_balance_delta_tl_tx_index__tl_block_number;
DROP INDEX IF EXISTS idx_fungible_balance_delta_amount;
DROP INDEX IF EXISTS idx_fungible_balance_delta_internal_transfer;
DROP INDEX IF EXISTS idx_fungible_balance_address;
DROP INDEX IF EXISTS idx_fungible_balance_contract;
DROP INDEX IF EXISTS idx_fungible_balance_contract_address;
DROP INDEX IF EXISTS idx_non_fungible_balance_delta_contract;
DROP INDEX IF EXISTS idx_non_fungible_balance_delta_contract_token_id;
DROP INDEX IF EXISTS idx_non_fungible_balance_delta_from;
DROP INDEX IF EXISTS idx_non_fungible_balance_delta_to;
DROP INDEX IF EXISTS idx_non_fungible_balance_delta_trace_location_block_hash;
DROP INDEX IF EXISTS idx_non_fungible_balance_address;
DROP INDEX IF EXISTS idx_non_fungible_balance_contract;
DROP INDEX IF EXISTS idx_non_fungible_balance_contract_address;
DROP INDEX IF EXISTS idx_erc20_metadata_name;
DROP INDEX IF EXISTS idx_erc20_metadata_symbol;
DROP INDEX IF EXISTS idx_erc721_metadata_name;
DROP INDEX IF EXISTS idx_erc721_metadata_symbol;
DROP INDEX IF EXISTS idx_contract_created_creator;
DROP INDEX IF EXISTS idx_contract_created_contract_type;
DROP INDEX IF EXISTS idx_contract_created_trace_location_block_hash;
DROP INDEX IF EXISTS idx_contract_destroyed_trace_location_block_hash;
DROP INDEX IF EXISTS idx_token_exchange_rates_name;
DROP INDEX IF EXISTS idx_token_exchange_rates_symbol;



/* Block header */
CREATE UNIQUE INDEX IF NOT EXISTS idx_block_header_number__hash__author ON canonical_block_header (number DESC, hash, author);
CREATE INDEX IF NOT EXISTS idx_block_header_author_hash ON canonical_block_header (author);
-- possibly missing index on parent hash

/* Transactions, receipts & traces */
CREATE UNIQUE INDEX IF NOT EXISTS idx_transaction_block_number__transaction_index ON transaction (block_number DESC, transaction_index DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_block_hash ON transaction (block_hash);
CREATE INDEX IF NOT EXISTS idx_transaction_to ON transaction ("to");
CREATE INDEX IF NOT EXISTS idx_transaction_from ON transaction ("from");
CREATE INDEX IF NOT EXISTS idx_transaction_trace_transaction_hash ON transaction_trace (transaction_hash);

/* Uncles */
CREATE UNIQUE INDEX IF NOT EXISTS idx_uncle_hash__nephew_hash__author ON uncle (hash, nephew_hash, author);
CREATE INDEX IF NOT EXISTS idx_uncle_number__nephew_hash__author ON uncle (number DESC, nephew_hash, author);
CREATE INDEX IF NOT EXISTS idx_uncle_height ON uncle (height DESC);

/* Contracts */
CREATE INDEX IF NOT EXISTS idx_contract_created_contract_type__tl_block_hash__address ON contract_created (contract_type, trace_location_block_hash, address)
WHERE contract_type = 'ERC20'; -- confirm only ERC20 relevant here
CREATE INDEX IF NOT EXISTS idx_contract_created_creator ON contract_created (creator);
CREATE INDEX IF NOT EXISTS idx_contract_created_address ON contract_created (address);
CREATE INDEX IF NOT EXISTS idx_contract_destroyed_address ON public.contract_destroyed (address);

/* Fungible/non-fungible balances */
CREATE UNIQUE INDEX IF NOT EXISTS idx_fungible_balance_contract__address__amount ON fungible_balance (contract, address, amount);
CREATE UNIQUE INDEX IF NOT EXISTS idx_non_fungible_balance_contract__address ON non_fungible_balance (contract, address);

/* Fungible balance deltas */
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_tl_block_hash ON fungible_balance_delta (trace_location_block_hash);
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_internal_transfer ON fungible_balance_delta (address, amount, delta_type, trace_location_block_hash, counterpart_address)
WHERE delta_type IN ('INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION');
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_address__delta_type__amount ON fungible_balance_delta (address, delta_type, amount)
WHERE amount > 0 and delta_type IN ('INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION');
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_counterpart_address__delta_type__amount ON fungible_balance_delta (counterpart_address, delta_type, amount)
WHERE amount > 0 and delta_type IN ('INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION');
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_delta_type__amount__tl_block_hash ON fungible_balance_delta (delta_type, amount, trace_location_block_hash)
WHERE delta_type IN ('BLOCK_REWARD', 'UNCLE_REWARD');
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_address__tl_block_hash ON fungible_balance_delta (address, trace_location_block_hash)
WHERE delta_type = 'UNCLE_REWARD';
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_block_number__tx_idx__trace_address ON fungible_balance_delta (trace_location_block_number DESC, trace_location_transaction_index DESC, trace_location_trace_address DESC);
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_delta_type__contract_address__amount ON fungible_balance_delta (delta_type, contract_address, amount)
WHERE delta_type = 'TOKEN_TRANSFER';
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_tl_timestamp ON fungible_balance_delta (trace_location_timestamp DESC)
WHERE delta_type = 'TOKEN_TRANSFER';
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_tl_transaction_hash ON fungible_balance_delta (trace_location_transaction_hash)
WHERE delta_type = 'TOKEN_TRANSFER';
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_address_contract_address ON fungible_balance_delta (address, contract_address);

/* Non-fungible balance deltas */
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_delta_contract_token_id ON non_fungible_balance_delta (contract, token_id);
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_delta_from ON non_fungible_balance_delta ("from");
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_delta_to ON non_fungible_balance_delta ("to");
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_delta_trace_location_block_hash ON non_fungible_balance_delta (trace_location_block_hash);
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_address ON non_fungible_balance (address);
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_contract_address ON non_fungible_balance (contract, address);
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_delta_to_contract ON non_fungible_balance_delta ("to", contract);
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_delta_from_contract ON non_fungible_balance_delta ("from", contract);

/* Token exchange rates */
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap_rank ON token_exchange_rates (market_cap_rank ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap ON token_exchange_rates (market_cap ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap_desc ON token_exchange_rates (market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_current_price ON token_exchange_rates (current_price ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_current_price_desc ON token_exchange_rates (current_price DESC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_total_volume ON token_exchange_rates (total_volume ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_total_volume_desc ON token_exchange_rates (total_volume DESC);
CREATE INDEX UNIQUE IF NOT EXISTS idx_token_exchange_rates_address ON token_exchange_rates (address);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_symbol ON token_exchange_rates (symbol);

/* Token metadata */
CREATE INDEX UNIQUE IF NOT EXISTS idx_erc20_metadata_address ON erc20_metadata (address);
CREATE INDEX UNIQUE IF NOT EXISTS idx_erc721_metadata_address ON erc721_metadata (address);

/* Update sync status */
UPDATE metadata set value = 'false' where key = 'sync_status';

