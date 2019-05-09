import { BigNumber, Buffer, Receipt, Trace, Transaction } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TxReceiptDto } from '@app/graphql/txs/dto/tx-receipt.dto'
import { TxTraceDto } from '@app/graphql/txs/dto/tx-trace.dto'

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
  timestamp!: number;
  creates?: string;
  chainId?: string;
  receipt?: TxReceiptDto;
  traces!: TxTraceDto[];
  successful!: boolean;

  constructor(data: TransactionEntity) {

    // Convert relations to Dto instances

    const { receipt, traces } = data
    if (receipt) {
      this.receipt = new TxReceiptDto(receipt)
    }
    if (traces) {
      this.traces = traces.map(t => new TxTraceDto(t))
    }
    delete data.receipt
    delete data.traces

    assignClean(this, data)
  }
}
