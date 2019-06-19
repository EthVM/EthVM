
/* add indexes for sorting token_search_results */
CREATE INDEX idx_token_exchange_rates__current_price ON token_exchange_rates(current_price);
CREATE INDEX idx_eth_list_contract_metadata__website ON eth_list_contract_metadata(website);
CREATE INDEX idx_eth_list_contract_metadata__logo ON eth_list_contract_metadata(logo);

/* create token_search_result view for sorting erc20 and erc721 tokens matching a query string */
CREATE VIEW token_search AS
SELECT  e20.name AS name,
        e20.symbol AS symbol,
        e20.address AS address,
        ter.current_price AS current_price,
        elcm.website AS website,
        elcm.logo AS logo,
          CASE
            WHEN current_price IS NULL THEN FALSE
            ELSE TRUE
          END
        AS has_current_price,
          CASE
            WHEN logo IS NULL THEN FALSE
            ELSE TRUE
          END
        AS has_logo,
          CASE
            WHEN website IS NULL THEN FALSE
            ELSE TRUE
          END
        AS has_website
FROM erc20_metadata AS e20
        LEFT JOIN token_exchange_rates AS ter ON ter.address = e20.address
        LEFT JOIN eth_list_contract_metadata AS elcm ON elcm.address = e20.address
UNION ALL
SELECT  e721.name,
        e721.symbol,
        e721.address,
        NULL,
        elcm2.website,
        elcm2.logo,
        FALSE,
        CASE
          WHEN logo IS NULL THEN FALSE
          ELSE TRUE
        END,
        CASE
          WHEN website IS NULL THEN FALSE
          ELSE TRUE
        END
FROM erc721_metadata AS e721
        LEFT JOIN eth_list_contract_metadata AS elcm2 ON elcm2.address = e721.address;
