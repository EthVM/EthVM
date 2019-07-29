/* Drop previous indexes */
DROP INDEX IF EXISTS idx_block_header_number;
DROP INDEX IF EXISTS idx_block_header_hash;
DROP INDEX IF EXISTS idx_block_header_parent_hash;
DROP INDEX IF EXISTS idx_block_header_author;
DROP INDEX IF EXISTS idx_block_metrics_header_number;
DROP INDEX IF EXISTS idx_block_metrics_header_block_hash;

/* Canonical block header */
CREATE INDEX IF NOT EXISTS idx_block_header_number ON canonical_block_header (number DESC);

/* Block metrics header */
CREATE INDEX IF NOT EXISTS idx_block_metrics_header_number ON block_metrics_header (number DESC);

/* Canonical block time */
CREATE INDEX IF NOT EXISTS idx_block_time_block_time ON canonical_block_time (block_time);
CREATE INDEX IF NOT EXISTS idx_block_time_timestamp ON canonical_block_time (timestamp DESC);

