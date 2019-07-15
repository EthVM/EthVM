CREATE VIEW canonical_token_detail AS
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
       ter.name AS ter_name,
       ter.symbol AS ter_symbol,
       ter.image,
       e20m.name AS e20_name,
       e20m.symbol AS e20_symbol,
       e20m.decimals AS e20_decimals,
       e20m.total_supply AS e20_total_supply,
       e721m.name AS e721_name,
       e721m.symbol AS e721_symbol
FROM contract AS c
       RIGHT JOIN canonical_block_header AS cb ON c.trace_created_at_block_hash = cb.hash
       LEFT JOIN eth_list_contract_metadata AS elcm ON c.address = elcm.address
       LEFT JOIN token_exchange_rates AS ter ON c.address = ter.address
       LEFT JOIN erc20_metadata AS e20m ON c.address = e20m.address
       LEFT JOIN erc721_metadata AS e721m ON c.address = e721m.address
WHERE cb.number IS NOT NULL
  AND c.address IS NOT NULL
  AND c.contract_type IN ('ERC20', 'ERC721');
