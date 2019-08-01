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
SELECT  fbd.id,
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
