CREATE TABLE transaction_fee
(
    transaction_hash CHAR(66) PRIMARY KEY,
    transaction_position INT NOT NULL,
    block_hash CHAR(66) NOT NULL,
    block_number NUMERIC NOT NULL,
    address CHAR(42) NOT NULL,
    transaction_fee NUMERIC NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

CREATE INDEX idx_transaction_fee__address ON transaction_fee(address);
CREATE INDEX idx_transaction_fee__transaction_fee ON transaction_fee(transaction_fee);

/* create indexes for sorting canonical_transaction view */
CREATE INDEX idx_transaction__value ON "transaction"("value");
CREATE INDEX idx_transaction__timestamp ON "transaction"("timestamp");
CREATE INDEX idx_transaction_trace__root_error ON transaction_trace(root_error);

DROP VIEW canonical_transaction;

/* recreate canonical_transaction view with "successful" field to represent trace status */
CREATE VIEW canonical_transaction AS
SELECT t.*,
      tt.root_error,
        CASE
          WHEN root_error IS NULL THEN true
          ELSE false
        END
      AS successful,
      tf.transaction_fee AS fee
FROM "transaction" AS t
       RIGHT JOIN canonical_block_header AS cb ON t.block_hash = cb.hash
       LEFT JOIN canonical_transaction_trace AS tt ON t.transaction_hash = tt.transaction_hash
       LEFT JOIN transaction_fee AS tf ON t.transaction_hash = tf.transaction_hash
WHERE cb.number IS NOT NULL
  AND t.transaction_hash IS NOT NULL;

/* add indexes for sorting token_search_results */
CREATE INDEX idx_token_exchange_rates__current_price ON token_exchange_rates(current_price);
CREATE INDEX idx_eth_list_contract_metadata__website ON eth_list_contract_metadata(website);
CREATE INDEX idx_eth_list_contract_metadata__logo ON eth_list_contract_metadata(logo);

/* create token_search_result view for sorting erc20 and erc721 tokens matching a query string */
CREATE VIEW token_search_result AS
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
