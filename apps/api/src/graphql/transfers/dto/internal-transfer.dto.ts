import { BigNumber, DeltaType, Transfer } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { InternalTransferEntity } from '@app/orm/entities/internal-transfer.entity'

export class InternalTransferDto implements Transfer {

  id!: string;
  to!: string;
  deltaType!: DeltaType;
  from?: string;
  contractAddress?: string;
  amount: BigNumber;
  traceLocationBlockHash!: string;
  traceLocationBlockNumber!: BigNumber;
  traceLocationTransactionHash?: string;
  traceLocationTransactionIndex?: number;
  timestamp!: Date;

  constructor(data: InternalTransferEntity) {
    assignClean(this, data)

    // Assign "to" and "from" depending on "isReceiving" flag
    this.to = data.isReceiving ? data.address : data.counterpartAddress!
    this.from = data.isReceiving ? data.counterpartAddress : data.address

  }
}
