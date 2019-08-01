CREATE VIEW balance AS
SELECT  fb.address,
        fb.contract,
        fb.amount,
        null AS token_id,
        fb.timestamp
FROM fungible_balance AS fb
UNION ALL
SELECT  nfb.address,
        nfb.contract,
        null,
        nfb.token_id,
        nfb.trace_location_timestamp
FROM non_fungible_balance AS nfb;
