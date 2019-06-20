CREATE INDEX idx_token_exchange_rates__name ON token_exchange_rates (name);
CREATE INDEX idx_token_exchange_rates__symbol ON token_exchange_rates (symbol);

/* create token_search_result view for sorting erc20 and erc721 tokens matching a query string */
CREATE VIEW token_metadata AS
SELECT  e20.name AS name,
        e20.symbol AS symbol,
        e20.address AS address,
        e20.decimals AS decimals,
        elcm.website AS website,
        elcm.logo AS logo,
        elcm.support AS support,
        'erc20' AS type
FROM erc20_metadata AS e20
        LEFT JOIN eth_list_contract_metadata AS elcm ON elcm.address = e20.address
UNION ALL
SELECT  e721.name,
        e721.symbol,
        e721.address,
        NULL,
        elcm2.website,
        elcm2.logo,
        elcm2.support,
        'erc721' AS type
FROM erc721_metadata AS e721
        LEFT JOIN eth_list_contract_metadata AS elcm2 ON elcm2.address = e721.address;
