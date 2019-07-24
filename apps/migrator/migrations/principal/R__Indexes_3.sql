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

/* findUncles, findLatestUncleBlockNumber */
CREATE INDEX IF NOT EXISTS  idx_uncle_number__nephew_hash__author ON uncle (number DESC, nephew_hash, author);
CREATE INDEX IF NOT EXISTS idx_uncle_hash ON uncle USING hash (hash);
CREATE INDEX IF NOT EXISTS idx_fungible_balance_delta_address__tl_block_hash ON fungible_balance_delta (address, trace_location_block_hash)
WHERE delta_type = 'UNCLE_REWARD';
CREATE INDEX IF NOT EXISTS idx_uncle_height ON uncle (height DESC);

/* findContractByAddress */
CREATE INDEX IF NOT EXISTS idx_contract_created_address ON contract_created USING hash (address);
CREATE INDEX IF NOT EXISTS idx_contract_destroyed_address ON public.contract_destroyed USING hash (address);
CREATE INDEX IF NOT EXISTS idx_eth_list_contract_metadata_address ON eth_list_contract_metadata USING hash (address);
CREATE INDEX IF NOT EXISTS idx_erc20_metadata_address ON erc20_metadata USING hash (address);

/* ContractService.findAllByAddress */
CREATE INDEX IF NOT EXISTS idx_erc721_metadata_address ON erc721_metadata USING hash (address);

/* findContractsCreatedBy */
CREATE INDEX IF NOT EXISTS idx_contract_created_creator ON contract_created USING hash (creator);

/* Receipt service */
CREATE INDEX IF NOT EXISTS idx_transaction_trace_transaction_hash ON transaction_trace USING hash (transaction_hash);

/* tokenHolders */
CREATE INDEX IF NOT EXISTS idx_fungible_balance_contract ON fungible_balance (contract); /* can be replaced by contract, adddress */
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_contract ON non_fungible_balance (contract);

/* tokenHolder */
CREATE INDEX IF NOT EXISTS idx_non_fungible_balance_contract__address ON non_fungible_balance (contract, address);
CREATE INDEX IF NOT EXISTS idx_fungible_balance_contract__address ON fungible_balance (contract, address);

/* tokenExchangeRates */
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap_rank ON token_exchange_rates (market_cap_rank ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap ON token_exchange_rates (market_cap ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_market_cap_desc ON token_exchange_rates (market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_current_price ON token_exchange_rates (current_price ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_current_price_desc ON token_exchange_rates (current_price DESC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_total_volume ON token_exchange_rates (total_volume ASC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_total_volume_desc ON token_exchange_rates (total_volume DESC);
CREATE INDEX IF NOT EXISTS idx_token_exchange_rates_address ON token_exchange_rates (address);
CREATE INDEX IF NOT EXISTS idx_contract_created_contract_type__tl_block_hash__address ON contract_created (contract_type, trace_location_block_hash, address)
WHERE contract_type = 'ERC20';
