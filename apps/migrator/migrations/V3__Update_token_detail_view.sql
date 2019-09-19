DROP VIEW token_detail;

CREATE VIEW token_detail AS
SELECT c.address,
       c.creator,
       c.contract_type,
       c.created_at_block_number,
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
