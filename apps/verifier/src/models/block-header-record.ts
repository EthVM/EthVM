import { UBigIntAsNumber } from '@app/utils'

export class BlockHeaderRecord {
  number: Buffer

  hash: Buffer
  parentHash: Buffer
  nonce: Buffer
  sha3Uncles: Buffer
  logsBloom: Buffer
  transactionsRoot: Buffer
  stateRoot: Buffer
  receiptsRoot: Buffer

  author: Buffer

  difficulty: Buffer
  extraData: Buffer

  gasLimit: Buffer
  gasUsed: Buffer

  timestamp: number

  constructor(data) {
    Object.assign(this, data)
  }

  get _number(): number {
    return UBigIntAsNumber(this.number)
  }

  get _difficulty(): number {
    return UBigIntAsNumber(this.difficulty)
  }

  get _gasLimit(): number {
    return UBigIntAsNumber(this.gasLimit)
  }

  get _gasUsed(): number {
    return UBigIntAsNumber(this.gasUsed)
  }
}
