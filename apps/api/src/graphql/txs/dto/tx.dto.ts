import { BigNumber, Buffer, Transaction } from '@app/graphql/schema'
import { assignClean, isGzip } from '@app/shared/utils'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TxReceiptDto } from '@app/graphql/txs/dto/tx-receipt.dto'
import { TxTraceDto } from '@app/graphql/txs/dto/tx-trace.dto'
import zlib from 'zlib'

export class TxDto implements Transaction {

  hash!: string;
  nonce!: BigNumber;
  blockHash!: string;
  blockNumber!: BigNumber;
  transactionIndex!: number;
  from!: string;
  to?: string;
  value!: BigNumber;
  gas!: BigNumber;
  gasPrice!: BigNumber;
  input!: Buffer;
  v!: string;
  r!: string;
  s!: string;
  timestamp!: Date;
  creates?: string;
  chainId?: string;
  receipt?: TxReceiptDto;
  trace!: TxTraceDto;
  successful!: boolean;

  constructor(data: TransactionEntity) {

    // Convert relations to Dto instances

    const { receipt, trace } = data
    if (receipt) {
      this.receipt = new TxReceiptDto(receipt)
    }
    if (trace) {
      this.trace = new TxTraceDto(trace)
    }
    delete data.receipt
    delete data.trace

    // Decompress input field if necessary

    const { input } = data
    if (input && isGzip(input)) {
      this.input = zlib.gunzipSync(input)
    }

    assignClean(this, data)
  }
}
