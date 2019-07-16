
/* Metadata */

CREATE OR REPLACE FUNCTION notify_metadata() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

  payload := json_build_object(
    'table', 'metadata',
    'action', TG_OP,
    'payload', json_build_object(
      'key', record.key,
      'value', record.value
      )
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_metadata ON metadata;

CREATE TRIGGER notify_metadata
  AFTER INSERT OR UPDATE OR DELETE
  ON metadata
  FOR EACH ROW
EXECUTE PROCEDURE notify_metadata();

/* Block header */

CREATE OR REPLACE FUNCTION notify_canonical_block_header() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

  payload := json_build_object(
    'table', 'canonical_block_header',
    'action', TG_OP,
    'payload', json_build_object(
      'block_hash', record.hash,
      'number', record.number,
      'transaction_count', record.transaction_count,
      'uncle_count', record.uncle_count,
      'author', record.author
      )
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_canonical_block_header ON canonical_block_header;

CREATE TRIGGER notify_canonical_block_header
  AFTER INSERT OR UPDATE OR DELETE
  ON canonical_block_header
  FOR EACH ROW
EXECUTE PROCEDURE notify_canonical_block_header();

/* Transaction */

CREATE OR REPLACE FUNCTION notify_transaction() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

  payload = json_build_object(
    'table', 'transaction',
    'action', TG_OP,
    'payload', json_build_object('transaction_hash', record.hash, 'block_hash', record.block_hash)
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_transaction ON "transaction";

CREATE TRIGGER notify_transaction
  AFTER INSERT OR UPDATE OR DELETE
  ON "transaction"
  FOR EACH ROW
EXECUTE PROCEDURE notify_transaction();

/* Transaction Receipt */

CREATE OR REPLACE FUNCTION notify_transaction_receipt() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

  payload := json_build_object(
    'table', 'transaction_receipt',
    'action', TG_OP,
    'payload', json_build_object('block_hash', record.block_hash, 'transaction_hash', record.transaction_hash)
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_transaction_receipt ON transaction_receipt;

CREATE TRIGGER notify_transaction_receipt
  AFTER INSERT OR UPDATE OR DELETE
  ON transaction_receipt
  FOR EACH ROW
EXECUTE PROCEDURE notify_transaction_receipt();

/* Transaction Trace */

CREATE OR REPLACE FUNCTION notify_transaction_trace() RETURNS TRIGGER AS
$body$
DECLARE
  record  RECORD;
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    record := OLD;
  ELSE
    record := NEW;
  END IF;

/* we only want notified about top level calls and rewards */

  IF (record.transaction_hash IS NULL) THEN
    /* block or uncle reward trace */

    payload := json_build_object(
      'table', 'transaction_trace',
      'action', TG_OP,
      'payload', json_build_object(
        'block_hash', record.block_hash
        )
      );

    PERFORM pg_notify('events', payload::text);

  ELSE
    /* root call trace */

    payload := json_build_object(
      'table', 'transaction_trace',
      'action', TG_OP,
      'payload', json_build_object(
        'block_hash', record.block_hash,
        'transaction_hash', record.transaction_hash,
        'root_error', record.root_error
        )
      );

    PERFORM pg_notify('events', payload::text);

  END IF;

  RETURN NULL;

END;
$body$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_transaction_trace ON transaction_trace;

CREATE TRIGGER notify_transaction_trace
  AFTER INSERT OR UPDATE OR DELETE
  ON transaction_trace
  FOR EACH ROW
EXECUTE PROCEDURE notify_transaction_trace();
