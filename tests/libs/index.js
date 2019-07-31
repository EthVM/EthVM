import client from "./client"
import {BigNumber} from "bignumber.js";

export async function getAccountInfo(address) {

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

  const { accountByAddress } = await client.request(query, { address });
  return accountByAddress;
}

export async function getBalance(address) {
  const account = await getAccountInfo(address);
  return account ? new BigNumber(account.balance) : undefined;
}
