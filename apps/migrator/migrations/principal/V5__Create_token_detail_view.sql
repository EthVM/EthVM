CREATE VIEW canonical_token_detail AS
SELECT cc.address,
       cc.creator,
       cc.contract_type,
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
       e20m.name         AS e20_name,
       e20m.symbol       AS e20_symbol,
       e20m.decimals     AS e20_decimals,
       e20m.total_supply AS e20_total_supply,
       e721m.name        AS e721_name,
       e721m.symbol      AS e721_symbol
FROM contract_created AS cc
       LEFT JOIN eth_list_contract_metadata AS elcm ON cc.address = elcm.address
       LEFT JOIN token_exchange_rates AS ter ON cc.address = ter.address
       LEFT JOIN erc20_metadata AS e20m ON cc.address = e20m.address
       LEFT JOIN erc721_metadata AS e721m ON cc.address = e721m.address
WHERE
      /* trace location fields are nullified when a fork happens */
      cc.trace_location_block_hash IS NOT NULL AND
      cc.contract_type IN ('ERC20', 'ERC721');
