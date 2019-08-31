
drop table sync_status;

create view sync_status as
    with _history as (
        SELECT
            *,
            row_number() OVER (PARTITION BY component ORDER BY block_number DESC) AS row_number
        FROM sync_status_history
    )
    select * from _history where row_number = 1;
