/* findAccountByAddress */
CREATE INDEX IF NOT EXISTS idx_fungible_balance_contract__address__amount ON fungible_balance (address, contract, amount);
CREATE INDEX IF NOT EXISTS idx_contract_created_address__trace_location_block_hash ON contract_created (address, trace_location_block_hash);

/* findIsMiner */
CREATE INDEX IF NOT EXISTS idx_block_header_author_hash ON canonical_block_header USING hash (author); /* decide if use hash index or not */

/* findIsContractCreator */
CREATE INDEX IF NOT EXISTS idx_contract_created_address__tl_block_hash__creator ON contract_created (address, trace_location_block_hash, creator); /* can replace index for findAccountByAddress */

/* findHasInternalTransfers */
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_internal_transfer ON fungible_balance_delta (address, amount, delta_type, trace_location_block_hash, counterpart_address)
WHERE delta_type IN ('INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION');
CREATE INDEX IF NOT EXISTS idx_block_header_number__hash ON canonical_block_header (number, hash);

/* calculateHashRate */
CREATE INDEX IF NOT EXISTS idx_block_header_number ON canonical_block_header (number DESC); /* already exists */

/* BlockService.findSummaries */
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_delta_type__amount__tl_block_hash ON fungible_balance_delta (delta_type, amount, trace_location_block_hash)
WHERE delta_type IN ('BLOCK_REWARD', 'UNCLE_REWARD');
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_tl_block_hash ON fungible_balance_delta USING hash (trace_location_block_hash);

/* BlockService.findSummariesByAuthor */
CREATE INDEX IF NOT EXISTS idx_block_header_number__hash__author ON canonical_block_header (number DESC, hash, author);

/* BlockService.findByHash */
CREATE INDEX IF NOT EXISTS idx_block_header_hash ON canonical_block_header USING hash (hash);

/* findUncleByHash */
CREATE INDEX IF NOT EXISTS idx_uncle_hash__nephew_hash__author ON uncle (hash, nephew_hash, author);

/* findUncles */
CREATE INDEX IF NOT EXISTS  idx_uncle_number__nephew_hash__author ON uncle (number DESC, nephew_hash, author);
CREATE INDEX IF NOT EXISTS idx_uncle_hash ON uncle USING hash (hash);
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_address__tl_block_hash ON fungible_balance_delta (address, trace_location_block_hash)
WHERE delta_type = 'UNCLE_REWARD';

/* findLatestUncleBlockNumber */
CREATE INDEX IF NOT EXISTS idx_uncle_height ON uncle (height DESC);
