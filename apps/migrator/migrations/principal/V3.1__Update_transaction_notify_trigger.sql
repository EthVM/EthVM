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
    'payload', json_build_object('transaction_hash', record.transaction_hash, 'block_hash', record.block_hash)
    );

  PERFORM pg_notify('events', payload::text);

  RETURN NULL;
END;
$body$ LANGUAGE plpgsql;
