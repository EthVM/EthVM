
/* Block Metric */

CREATE OR REPLACE FUNCTION notify_block_metric() RETURNS TRIGGER AS
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
    'table', TG_ARGV[0],
    'action', TG_OP,
    'payload', json_build_object(
      'block_hash', record.block_hash,
      'timestamp', record.timestamp
      )
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_block_metrics_header ON block_metrics_header;

CREATE TRIGGER notify_block_metrics_header
  AFTER INSERT OR UPDATE OR DELETE
  ON block_metrics_header
  FOR EACH ROW
EXECUTE PROCEDURE notify_block_metric('block_metrics_header');

DROP TRIGGER IF EXISTS notify_block_metrics_transaction ON block_metrics_transaction;

CREATE TRIGGER notify_block_metrics_transaction
  AFTER INSERT OR UPDATE OR DELETE
  ON block_metrics_transaction
  FOR EACH ROW
EXECUTE PROCEDURE notify_block_metric('block_metrics_transaction');

DROP TRIGGER IF EXISTS notify_block_metrics_transaction_trace ON block_metrics_transaction_trace;

CREATE TRIGGER notify_block_metrics_transaction_trace
  AFTER INSERT OR UPDATE OR DELETE
  ON block_metrics_transaction_trace
  FOR EACH ROW
EXECUTE PROCEDURE notify_block_metric('block_metrics_transaction_trace');

DROP TRIGGER IF EXISTS notify_block_metrics_transaction_fee ON block_metrics_transaction_fee;

CREATE TRIGGER notify_block_metrics_transaction_fee
  AFTER INSERT OR UPDATE OR DELETE
  ON block_metrics_transaction_fee
  FOR EACH ROW
EXECUTE PROCEDURE notify_block_metric('block_metrics_transaction_fee');
