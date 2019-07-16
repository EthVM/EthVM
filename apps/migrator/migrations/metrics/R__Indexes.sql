
/* Block Header */

CREATE INDEX IF NOT EXISTS idx_block_header_number ON canonical_block_header (number DESC);
CREATE INDEX IF NOT EXISTS idx_block_header_hash ON canonical_block_header (hash);
CREATE INDEX IF NOT EXISTS idx_block_header_parent_hash ON canonical_block_header (parent_hash);
CREATE INDEX IF NOT EXISTS idx_block_header_author ON canonical_block_header (author);

/* Block Metrics Header */

CREATE INDEX IF NOT EXISTS idx_block_metrics_header_number ON block_metrics_header (number DESC);
CREATE INDEX IF NOT EXISTS idx_block_metrics_header_block_hash ON block_metrics_header (block_hash);
