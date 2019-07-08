CREATE INDEX idx_block_header_number ON canonical_block_header (number DESC);
CREATE INDEX idx_block_header_hash ON canonical_block_header (hash);
CREATE INDEX idx_block_header_parent_hash ON canonical_block_header (parent_hash);
CREATE INDEX idx_block_header_author ON canonical_block_header (author);

CREATE INDEX idx_uncle_hash ON uncle (hash);
CREATE INDEX idx_uncle_author on uncle (author);
CREATE INDEX idx_uncle_nephew_hash ON uncle (nephew_hash);
CREATE INDEX idx_uncle_number ON uncle (number);
CREATE INDEX idx_uncle_height ON uncle (height);

CREATE INDEX idx_transaction_hash ON transaction (hash);
CREATE INDEX idx_transaction_block_hash ON transaction (block_hash);
CREATE INDEX idx_transaction_from ON transaction ("from");
CREATE INDEX idx_transaction_to ON transaction ("to");

CREATE INDEX idx_transaction_transaction_index ON transaction (transaction_index DESC);
CREATE INDEX idx_transaction_block_number ON transaction (block_number DESC);
CREATE INDEX idx_transaction_block_number__transaction_index ON transaction (block_number DESC, transaction_index DESC);

CREATE INDEX idx_transaction_receipt_block_hash ON transaction_receipt (block_hash);
CREATE INDEX idx_transaction_receipt_from ON transaction_receipt ("from");
CREATE INDEX idx_transaction_receipt_to ON transaction_receipt ("to");
CREATE INDEX idx_transaction_receipt_from_to ON transaction_receipt ("from", "to");
CREATE INDEX idx_transaction_receipt_contract_address ON transaction_receipt ("contract_address");

CREATE INDEX idx_transaction_trace_block_hash ON transaction_trace (block_hash);
CREATE INDEX idx_transaction_trace_transaction_hash ON transaction_trace (transaction_hash);

CREATE INDEX idx_contract_creator ON contract (creator);
CREATE INDEX idx_contract_contract_type ON contract (contract_type);
CREATE INDEX idx_contract_trace_created_at_block_hash ON contract (trace_created_at_block_hash);

CREATE INDEX idx_fungible_balance_delta_address ON fungible_balance_delta (address);
CREATE INDEX idx_fungible_balance_delta_contract_address ON fungible_balance_delta (contract_address);
CREATE INDEX idx_fungible_balance_delta_delta_type__contract_address ON fungible_balance_delta (contract_address, delta_type);
CREATE INDEX idx_fungible_balance_delta_counterpart_address ON fungible_balance_delta (counterpart_address);
CREATE INDEX idx_fungible_balance_delta_token_type ON fungible_balance_delta (token_type);
CREATE INDEX idx_fungible_balance_delta_delta_type ON fungible_balance_delta (delta_type);
CREATE INDEX idx_fungible_balance_delta_trace_location_block_hash ON fungible_balance_delta (trace_location_block_hash);
CREATE INDEX idx_fungible_balance_delta_trace_location_tx_index__trace_location_block_number ON fungible_balance_delta (trace_location_transaction_index DESC, trace_location_block_number DESC);
CREATE INDEX idx_fungible_balance_delta_amount ON fungible_balance_delta (amount);

CREATE INDEX idx_fungible_balance_address ON fungible_balance (address);
CREATE INDEX idx_fungible_balance_contract ON fungible_balance (contract);
CREATE INDEX idx_fungible_balance_contract_address ON fungible_balance (contract, address);

CREATE INDEX idx_non_fungible_balance_address ON non_fungible_balance (address);
CREATE INDEX idx_non_fungible_balance_contract ON non_fungible_balance (contract);
CREATE INDEX idx_non_fungible_balance_contract_address ON non_fungible_balance (contract, address);

CREATE INDEX idx_non_fungible_balance_delta_contract ON non_fungible_balance_delta (contract);
CREATE INDEX idx_non_fungible_balance_delta_contract_token_id ON non_fungible_balance_delta (contract, token_id);
CREATE INDEX idx_non_fungible_balance_delta_from ON non_fungible_balance_delta ("from");
CREATE INDEX idx_non_fungible_balance_delta_to ON non_fungible_balance_delta ("to");
CREATE INDEX idx_non_fungible_balance_delta_from_to ON non_fungible_balance_delta ("from", "to");
CREATE INDEX idx_non_fungible_balance_delta_trace_location_block_hash ON non_fungible_balance_delta (trace_location_block_hash);

CREATE INDEX idx_erc20_metadata_name ON erc20_metadata (name);
CREATE INDEX idx_erc20_metadata_symbol ON erc20_metadata (symbol);

CREATE INDEX idx_erc721_metadata_name ON erc721_metadata (name);
CREATE INDEX idx_erc721_metadata_symbol ON erc721_metadata (symbol);
