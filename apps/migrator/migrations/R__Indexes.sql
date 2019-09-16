
create index if not exists idx_sync_status ON sync_status (component, block_number desc);
create index if not exists idx_sync_status_history ON sync_status_history (component, block_number desc);

/* Account service */

create unique index if not exists idx_ether_balance_for_address on balance (block_number desc, address) where contract_address is null;
create unique index if not exists idx_transaction_counts_for_address on address_transaction_count (block_number desc, address);
create unique index if not exists idx_is_miner on block_header (number desc, author);
create index if not exists idx_is_contract_creator on contract (creator, created_at_block_number desc);
create index if not exists idx_address_has_internal_transfers on balance_delta (address, block_number desc, transaction_index desc, trace_address desc) where delta_type IN ('INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION');
create index if not exists idx_is_contract on contract (created_at_block_number desc, creator);

/* Uncle service */

create unique index if not exists idx_uncle_by_hash on uncle (hash);
create unique index if not exists idx_uncle_for_hash on uncle (height DESC, hash);
create index if not exists idx_uncle_rewards_for_block_and_address on balance_delta (block_hash, address) where delta_type = 'UNCLE_REWARD';
create unique index if not exists idx_uncle_count on canonical_count (block_number desc) where entity = 'uncle';

/* Tx service */
create unique index if not exists idx_tx_by_hash on transaction (hash);
create index if not exists idx_tx_by_block_hash on transaction (block_hash);
create unique index if not exists idx_tx_for_hash on transaction (block_number desc, hash, block_number desc, transaction_index desc);
create unique index if not exists idx_tx_for_block_number on transaction (block_number desc, transaction_index desc);
create unique index if not exists idx_tx_count on canonical_count (block_number desc) where entity = 'transaction';
create unique index if not exists idx_tx_counts_for_address on address_transaction_count (block_number desc, address);

create index if not exists idx_tx_for_from on transaction ("from", block_number desc);
create index if not exists idx_tx_for_to on transaction ("to", block_number desc) where "to" is not null;

/* Transfer service */
create index if not exists idx_contract_token_transfers on balance_delta (block_number desc, contract_address, address, transaction_index desc, trace_address desc) where delta_type = 'TOKEN_TRANSFER';
create index if not exists idx_internal_transactions_for_address on balance_delta (block_number desc, contract_address, address, transaction_index desc, trace_address desc) where delta_type IN ('INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION');
create index if not exists idx_balance_deltas on balance_delta (block_number desc, timestamp desc, delta_type, address, contract_address, transaction_index desc, id desc);

/* Trace service */
create index if not exists idx_trace_by_block_hash on trace (block_hash);
create unique index if not exists idx_trace_by_tx_hash on trace (transaction_hash) where transaction_hash is not null;
create index if not exists idx_trace_by_block_number on trace (block_number);

/* Receipt service */
create unique index if not exists idx_receipt_by_tx_hash on transaction_receipt (transaction_hash);
create index if not exists idx_receipt_by_block_number on transaction_receipt (block_number);

/* Contract service */
create index if not exists idx_contracts_for_address on contract (created_at_block_number desc, address);
create index if not exists idx_contracts_for_creator on contract (created_at_block_number desc, creator);
create index if not exists idx_contracts_by_type on contract (created_at_block_number desc, contract_type);

create index if not exists idx_contracts_by_created_asc on contract(created_at_block_number asc);
create index if not exists idx_contracts_by_destroyed_asc on contract(destroyed_at_block_number asc);

/* Block metrics service */

create unique index if not exists idx_blocks_metrics_header_by_block_hash on block_metrics_header (timestamp, hash);
create unique index if not exists idx_blocks_metrics_trace_by_block_hash on block_metrics_trace (timestamp, hash);

/* Block service */
create unique index if not exists idx_block_header_by_hash on block_header (hash);
create unique index if not exists idx_block_metrics_trace_hash on block_metrics_trace (hash, timestamp);

/* Token service */
create index if not exists idx_all_token_balances_for_contract on balance (block_number desc, contract_address, address);
create index if not exists idx_token_balances_for_contract on balance (contract_address, address, block_number desc);

create index if not exists idx_balances_for_address on balance (address, contract_address, block_number desc);
create index if not exists idx_balances_by_token_type_block_number on balance (token_type, block_number);

/* Token exchange rates */
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap_rank ON token_exchange_rate (market_cap_rank ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap ON token_exchange_rate (market_cap ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap_desc ON token_exchange_rate (market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_current_price ON token_exchange_rate (current_price ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_current_price_desc ON token_exchange_rate (current_price DESC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_total_volume ON token_exchange_rate (total_volume ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_total_volume_desc ON token_exchange_rate (total_volume DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_token_exchange_rates_address ON token_exchange_rate (address);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_symbol ON token_exchange_rate (symbol);

create index if not exists idx_balance_by_token_type_block_number on balance (token_type, block_number asc);
create index if not exists idx_balance_by_token_type_block_number_desc on balance (token_type, block_number desc);

CREATE INDEX IF NOT EXISTS idx_balance_delta_by_block_hash on balance_delta(block_hash);
CREATE INDEX IF NOT EXISTS idx_balance_delta_by_address on balance_delta(address);
CREATE INDEX IF NOT EXISTS idx_balance_delta_by_contract_address on balance_delta(contract_address);
CREATE INDEX IF NOT EXISTS idx_balance_delta_by_delta_type on balance_delta(delta_type);
CREATE INDEX IF NOT EXISTS idx_balance_delta_by_token_type_block_number on balance_delta(token_type, block_number asc);
CREATE INDEX IF NOT EXISTS idx_balance_delta_by_token_type_block_number_alternative on balance_delta(block_number asc, token_type);
CREATE INDEX IF NOT EXISTS idx_balance_delta_by_token_type_block_number_desc on balance_delta(token_type, block_number desc);
CREATE INDEX IF NOT EXISTS idx_balance_delta_by_token_type_block_number_desc_alternative on balance_delta(block_number desc, token_type);
CREATE INDEX IF NOT EXISTS idx_balance_delta_number_contract on balance_delta(block_number, contract_address);

create index if not exists idx_address_transaction_counts_by_number on address_transaction_count (block_number asc);
create index if not exists idx_address_transaction_count_deltas_by_number on address_transaction_count_delta (block_number asc);

create index if not exists idx_address_transaction_counts_by_number_desc on address_transaction_count (block_number desc);
create index if not exists idx_address_transaction_count_deltas_by_number_desc on address_transaction_count_delta (block_number desc);


create index if not exists idx_address_internal_tx_counts_by_number on address_internal_transaction_count(block_number asc);
create index if not exists idx_address_internal_tx_counts_by_number_desc on address_internal_transaction_count(block_number desc);
create index if not exists idx_canonical_count_by_block_number on canonical_count(block_number desc);

create index if not exists idx_processor_hash_log_processor on processor_hash_log (processor_id, block_number desc);

create index if not exists idx_miner_block_count_by_number on miner_block_count (block_number asc);
create index if not exists idx_miner_block_count_by_number_desc on miner_block_count (block_number desc);

create index if not exists idx_address_token_count_by_token_type on address_token_count (token_type, block_number asc);
create index if not exists idx_address_token_count_delta_by_token_type on address_token_count_delta (token_type, block_number asc);
create index if not exists idx_contract_holder_count_by_token_type on contract_holder_count (token_type, block_number asc);
create index if not exists idx_contract_holder_count_delta_by_token_type on contract_holder_count_delta (token_type, block_number asc);

create index if not exists idx_address_token_count_by_token_type_desc on address_token_count (token_type, block_number desc);
create index if not exists idx_address_token_count_delta_by_token_type_desc on address_token_count_delta (token_type, block_number desc);
create index if not exists idx_contract_holder_count_by_token_type_desc on contract_holder_count (token_type, block_number desc);
create index if not exists idx_contract_holder_count_delta_by_token_type_desc on contract_holder_count_delta (token_type, block_number desc);


create index if not exists idx_contract_metadata_by_block_number on contract_metadata(block_number asc);
create index if not exists idx_contract_metadata_by_block_number_desc on contract_metadata(block_number desc);
