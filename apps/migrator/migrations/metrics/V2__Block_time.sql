CREATE TABLE canonical_block_time
(
  number             NUMERIC PRIMARY KEY,
  timestamp          TIMESTAMP NOT NULL,
  block_time         INT       NULL
);

ALTER TABLE canonical_block_header
  DROP COLUMN  block_time;
