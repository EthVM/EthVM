
DROP VIEW canonical_internal_transfer;

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
       fbd.trace_location_timestamp AS "timestamp"
FROM fungible_balance_delta AS fbd
         RIGHT JOIN canonical_block_header AS cb ON fbd.trace_location_block_hash = cb.hash
WHERE cb.number IS NOT NULL
  AND fbd.delta_type IN ('INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION');
