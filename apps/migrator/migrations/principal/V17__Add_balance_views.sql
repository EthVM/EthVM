-- Change type of all "contract" fields in balance-related models to varchar - ensure strings of 42 spaces are changed to empty strings
-- In order to do this, it's necessary to drop all views built on these tables and rebuild them after

-- Function to replace string of 42 spaces with empty string
CREATE OR REPLACE FUNCTION contract_to_varchar(contract CHARACTER)
    RETURNS VARCHAR AS
$BODY$
BEGIN
    IF (contract = '                                          ')
    THEN contract := '';
    END IF;
    RETURN contract;
END;
$BODY$ LANGUAGE plpgsql;

-- Drop all views built on balance-related models
DROP VIEW IF EXISTS canonical_account;
DROP VIEW IF EXISTS canonical_ether_balance;
DROP VIEW IF EXISTS canonical_internal_transfer;
DROP VIEW IF EXISTS canonical_fungible_balance_transfer;
DROP VIEW IF EXISTS canonical_erc20_balance;
DROP VIEW IF EXISTS canonical_erc721_balance;
DROP VIEW IF EXISTS canonical_block_reward;
DROP VIEW IF EXISTS block_reward;
DROP VIEW IF EXISTS uncle_reward;
DROP VIEW IF EXISTS canonical_fungible_balance_delta;
DROP VIEW IF EXISTS canonical_non_fungible_balance_delta;

-- Change column types
ALTER TABLE fungible_balance ALTER COLUMN contract TYPE VARCHAR USING contract_to_varchar(contract);
ALTER TABLE fungible_balance_delta ALTER COLUMN contract_address TYPE VARCHAR USING contract_to_varchar(contract_address);
ALTER TABLE non_fungible_balance ALTER COLUMN contract TYPE VARCHAR USING contract_to_varchar(contract);
ALTER TABLE non_fungible_balance_delta ALTER COLUMN contract TYPE VARCHAR USING contract_to_varchar(contract);

-- Re-create views which were dropped
CREATE VIEW canonical_internal_transfer AS
SELECT fbd.id,
       fbd.counterpart_address,
       fbd.address,
       fbd.contract_address,
       fbd.delta_type,
       fbd.amount,
       fbd.trace_location_block_hash,
       fbd.trace_location_block_number,
       fbd.trace_location_transaction_hash,
       fbd.trace_location_transaction_index,
       fbd.trace_location_trace_address,
       fbd.trace_location_timestamp AS "timestamp",
       fbd.is_receiving
FROM fungible_balance_delta AS fbd
         RIGHT JOIN canonical_block_header AS cb ON fbd.trace_location_block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND fbd.delta_type IN ('INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION');

CREATE VIEW canonical_fungible_balance_delta AS
SELECT fbd.*
FROM fungible_balance_delta AS fbd
       RIGHT JOIN canonical_block_header AS cb ON fbd.trace_location_block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND fbd.address IS NOT NULL;

CREATE VIEW canonical_fungible_balance_transfer AS
SELECT fbd.id,
       fbd.counterpart_address      AS "from",
       fbd.address                  AS "to",
       fbd.contract_address,
       fbd.delta_type,
       fbd.token_type,
       fbd.amount,
       fbd.trace_location_block_hash,
       fbd.trace_location_block_number,
       fbd.trace_location_transaction_hash,
       fbd.trace_location_transaction_index,
       fbd.trace_location_log_index,
       fbd.trace_location_trace_address,
       fbd.trace_location_timestamp AS "timestamp"
FROM fungible_balance_delta as fbd
  RIGHT JOIN canonical_block_header AS cb ON fbd.trace_location_block_hash = cb.hash
WHERE cb.number IS NOT NULL
AND fbd.address IS NOT NULL
AND fbd.amount > 0;

CREATE VIEW canonical_non_fungible_balance_delta AS
SELECT nfbd.*
FROM non_fungible_balance_delta AS nfbd
       RIGHT JOIN canonical_block_header AS cb ON nfbd.trace_location_block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND nfbd.contract IS NOT NULL;

CREATE VIEW canonical_erc20_balance AS
SELECT fb.contract,
       fb.address,
       fb.amount
FROM fungible_balance AS fb
       LEFT JOIN canonical_contract as c on fb.contract = c.address
WHERE fb.contract IS NOT NULL
  AND fb.contract != ''
  AND c.contract_type = 'ERC20';

CREATE VIEW canonical_erc721_balance AS
SELECT nfb.*
FROM non_fungible_balance AS nfb
       LEFT JOIN canonical_contract as c on nfb.contract = c.address
WHERE nfb.contract IS NOT NULL
  AND nfb.contract != ''
  AND c.contract_type = 'ERC721';

CREATE VIEW block_reward AS
SELECT address,
       trace_location_block_hash as block_hash,
       amount,
       delta_type
FROM fungible_balance_delta
WHERE delta_type IN ('BLOCK_REWARD', 'UNCLE_REWARD');

CREATE VIEW uncle_reward AS
SELECT address,
       trace_location_block_hash as block_hash,
       amount
FROM fungible_balance_delta
WHERE delta_type = 'UNCLE_REWARD';

CREATE VIEW canonical_ether_balance AS
SELECT fb.address,
       fb.amount
FROM fungible_balance AS fb
WHERE contract = '';

CREATE VIEW canonical_block_reward AS
SELECT br.*
FROM block_reward AS br
       RIGHT JOIN canonical_block_header AS cb ON br.block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND br.amount IS NOT NULL;

CREATE VIEW canonical_account AS
SELECT fb.address,
       fb.amount                       AS balance,
       (SELECT total_in + total_out
        FROM transaction_count AS tc
        WHERE tc.address = fb.address) AS total_tx_count,
       (SELECT total_in
        FROM transaction_count AS tc
        WHERE tc.address = fb.address) AS in_tx_count,
       (SELECT total_out
        FROM transaction_count AS tc
        WHERE tc.address = fb.address) AS out_tx_count,
       CASE
         WHEN cont.creator IS NULL THEN
           FALSE
         ELSE
           TRUE
         END                           AS is_contract
FROM fungible_balance AS fb
       LEFT JOIN canonical_contract AS cont ON fb.address = cont.address
WHERE fb.contract = ''
ORDER BY balance DESC;

-- Create new balance views
CREATE VIEW balance AS
SELECT  fb.address,
        fb.contract,
        fb.amount,
        null AS token_id,
        fb.timestamp
FROM fungible_balance AS fb
UNION ALL
SELECT  nfb.address,
        nfb.contract,
        null,
        nfb.token_id,
        nfb.trace_location_timestamp
FROM non_fungible_balance AS nfb;

-- Necessary to UNION with non_fungible_balance_delta twice to simulate "double-entry bookkeeping" approach, reversing "to", "from" and "is_receiving" fields
CREATE VIEW canonical_balance_delta AS
SELECT  fbd.id * -1 AS id,
        fbd.address,
        fbd.contract_address,
        fbd.counterpart_address,
        fbd.token_type,
        fbd.delta_type,
        fbd.trace_location_block_hash,
        fbd.trace_location_block_number,
        fbd.trace_location_transaction_hash,
        fbd.trace_location_transaction_index,
        fbd.trace_location_log_index,
        fbd.trace_location_trace_address,
        fbd.trace_location_timestamp AS "timestamp",
        fbd.amount,
        fbd.is_receiving,
        null AS token_id
FROM fungible_balance_delta AS fbd
        RIGHT JOIN canonical_block_header AS cbh ON fbd.trace_location_block_hash = cbh.hash
        WHERE cbh.number IS NOT NULL
        AND fbd.id IS NOT NULL
UNION ALL
SELECT  nfbd.id,
        nfbd.to,
        nfbd.contract,
        nfbd.from,
        nfbd.token_type,
        'TOKEN_TRANSFER',
        nfbd.trace_location_block_hash,
        nfbd.trace_location_block_number,
        nfbd.trace_location_transaction_hash,
        nfbd.trace_location_transaction_index,
        nfbd.trace_location_log_index,
        nfbd.trace_location_trace_address,
        nfbd.trace_location_timestamp,
        null,
        true,
        nfbd.token_id
FROM non_fungible_balance_delta AS nfbd
        RIGHT JOIN canonical_block_header AS cbh ON nfbd.trace_location_block_hash = cbh.hash
        WHERE cbh.number IS NOT NULL
        AND nfbd.id IS NOT NULL
UNION ALL
SELECT  nfbd.id,
        nfbd.from,
        nfbd.contract,
        nfbd.to,
        nfbd.token_type,
        'TOKEN_TRANSFER',
        nfbd.trace_location_block_hash,
        nfbd.trace_location_block_number,
        nfbd.trace_location_transaction_hash,
        nfbd.trace_location_transaction_index,
        nfbd.trace_location_log_index,
        nfbd.trace_location_trace_address,
        nfbd.trace_location_timestamp,
        null,
        false,
        nfbd.token_id
FROM non_fungible_balance_delta AS nfbd
        RIGHT JOIN canonical_block_header AS cbh ON nfbd.trace_location_block_hash = cbh.hash
        WHERE cbh.number IS NOT NULL
        AND nfbd.id IS NOT NULL;
