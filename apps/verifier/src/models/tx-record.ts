export class TxRecord {

  hash: Buffer;
  nonce: Buffer;

  blockHash: Buffer;
  blockNumber: Buffer;
  transactionIndex: number;

  from: Buffer;
  to?: Buffer;

  value: Buffer;
  gasPrice: Buffer;
  gas: Buffer;

  input?: Buffer;

  v: Buffer;
  r: Buffer;
  s: Buffer;

  creates?: Buffer;

  constructor(props) {
    Object.assign(this, props);
  }

}
