/* Fungible balance */
CREATE INDEX IF NOT EXISTS idx_fungible_balance_contract_address ON fungible_balance (contract, address); /* Reverse handled by PK */
CREATE INDEX IF NOT EXISTS idx_fungible_balance_address_amount ON fungible_balance (address, amount) WHERE contract IS NOT NULL AND contract != ''; /* Used for erc20 balances only */

/* Non-fungible balance */
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_contract ON non_fungible_balance USING hash (contract);

/* Contracts */
CREATE INDEX IF NOT EXISTS idx_contract_created_block_hash_creator ON contract_created (trace_location_block_hash, creator);
CREATE INDEX IF NOT EXISTS idx_contract_created_block_hash_address ON contract_created (trace_location_block_hash, address);
CREATE INDEX IF NOT EXISTS idx_contract_created_contract_type_address ON contract_created (contract_type, address);
CREATE INDEX IF NOT EXISTS idx_contract_destroyed_block_hash ON contract_destroyed (trace_location_block_hash);

/* Token exchange rates */

/* Block header */
CREATE INDEX IF NOT EXISTS idx_block_header_author ON canonical_block_header USING hash (author);

