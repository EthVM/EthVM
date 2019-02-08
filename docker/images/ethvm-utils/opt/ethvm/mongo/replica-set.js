rs.initiate(
  {
    _id: "ethvm-replicaset",
    version: 1,
    members: [
      { _id: 0, host: "mongodb:27017" }
    ]
  }
);
