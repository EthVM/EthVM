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
       LEFT JOIN canonical_transaction_trace AS tt ON t.hash = tt.transaction_hash
       LEFT JOIN transaction_fee AS tf ON t.hash = tf.transaction_hash
WHERE cb.number IS NOT NULL
  AND t.hash IS NOT NULL;
