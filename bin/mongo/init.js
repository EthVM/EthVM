rs.initiate();

conn = new Mongo();
db = conn.getDB('ethvm_local');

db.createCollection('blocks');
db.createCollection('balances');

