import client from "./client"

const getAccountInfo = address => {
  const query = `
    query getAccountByAddress($address: String!) {
      accountByAddress(address: $address) {
        balance,
        totalTxCount,
        inTxCount,
        outTxCount
      }
    }
  `;
  return client
    .request(query, {
      address: address
    })
    .then(data => data.accountByAddress)
};

export { getAccountInfo }
