DROP VIEW canonical_token_exchange_rates;

CREATE VIEW canonical_token_exchange_rates AS
SELECT ter.*
FROM token_exchange_rates AS ter
       INNER JOIN canonical_contract AS cc on ter.address = cc.address
       WHERE cc.contract_type = 'ERC20';
