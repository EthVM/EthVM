create table metadata
(
  "key"   VARCHAR(64) PRIMARY KEY,
  "value" VARCHAR(256) NULL
);

INSERT INTO metadata
VALUES ('sync_status', 'true');

CREATE FUNCTION notify_metadata() RETURNS TRIGGER AS
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

CREATE TRIGGER notify_metadata
  AFTER INSERT OR UPDATE OR DELETE
  ON metadata
  FOR EACH ROW
EXECUTE PROCEDURE notify_metadata();
