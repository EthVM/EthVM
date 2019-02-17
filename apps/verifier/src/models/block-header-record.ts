import BigInteger from 'node-biginteger';

export class BlockHeaderRecord {

  number: Buffer;

  hash: Buffer;
  parentHash: Buffer;
  nonce: Buffer;
  sha3Uncles: Buffer;
  logsBloom: Buffer;
  transactionsRoot: Buffer;
  stateRoot: Buffer;
  receiptsRoot: Buffer;

  author: Buffer;

  difficulty: Buffer;
  extraData: Buffer;

  gasLimit: Buffer;
  gasUsed: Buffer;

  timestamp: number;

  constructor(data) {
    Object.assign(this, data);
  }

  private unsignedBigInteger(buffer: Buffer): BigInteger {
    return BigInteger.fromBuffer(1, buffer).longValue().toNumber();
  }

  get _number(): BigInteger {
    return this.unsignedBigInteger(this.number);
  }

  get _difficulty(): BigInteger {
    return this.unsignedBigInteger(this.difficulty);
  }

  get _gasLimit(): BigInteger {
    return this.unsignedBigInteger(this.gasLimit);
  }

  get _gasUsed(): BigInteger {
    return this.unsignedBigInteger(this.gasUsed);
  }

}
