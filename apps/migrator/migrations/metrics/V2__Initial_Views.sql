-- CREATE VIEW account AS
-- SELECT
--     b.address,
--     b.block_number,
--     b.balance,
--     atc.total AS total_tx_count,
--     atc.total_out AS out_tx_count,
--     atc.total_in AS in_tx_count,
--     mbc.count AS mine_blocks_count,
--     CASE
--          WHEN cont.creator IS NULL THEN
--            FALSE
--          ELSE
--            TRUE
--          END                           AS is_contract
-- FROM balance AS b WHERE contract_address = ''
-- LEFT JOIN address_transaction_count AS atc ON atc.address = b.address AND atc.block_number = b.block_number
-- LEFT JOIN miner_block_count AS mbc ON mbc.author = b.address AND mtc.block_number = b.block_number
-- LEFT JOIN contract AS cont ON cont.address = b.address
-- ORDER BY block_number DESC;
-- --


CREATE VIEW block_reward AS
SELECT address,
       block_hash,
       amount,
       delta_type
FROM balance_delta
WHERE delta_type IN ('BLOCK_REWARD', 'UNCLE_REWARD');

CREATE VIEW token_metadata AS
SELECT  cm.name AS name,
        cm.symbol AS symbol,
        cm.address AS address,
        cm.decimals AS decimals,
        elcm.website AS website,
        elcm.logo AS logo,
        elcm.support AS support,
        elcm.type AS type
FROM contract_metadata AS cm
        LEFT JOIN eth_list_contract_metadata AS elcm ON elcm.address = cm.address;

CREATE VIEW token_detail AS
SELECT c.address,
       c.creator,
       c.contract_type,
       elcm.name,
       elcm.symbol,
       elcm.decimals,
       elcm.logo,
       elcm.support,
       elcm.social,
       elcm.website,
       ter.current_price,
       ter.circulating_supply,
       ter.total_supply,
       ter.market_cap,
       ter.price_change_percentage24h,
       ter.total_volume,
       ter.name          AS ter_name,
       ter.symbol        AS ter_symbol,
       ter.image,
       cm.name         AS cm_name,
       cm.symbol       AS cm_symbol,
       cm.decimals     AS cm_decimals,
       cm.total_supply AS cm_total_supply
FROM contract AS c
       LEFT JOIN eth_list_contract_metadata AS elcm ON c.address = elcm.address
       LEFT JOIN token_exchange_rate AS ter ON c.address = ter.address
       LEFT JOIN contract_metadata AS cm ON c.address = cm.address
WHERE c.contract_type IN ('ERC20', 'ERC721');

CREATE VIEW canonical_token_exchange_rate AS
SELECT ter.*
FROM token_exchange_rate AS ter
    INNER JOIN contract AS c ON c.address = ter.address
WHERE c.contract_type = 'ERC20';
