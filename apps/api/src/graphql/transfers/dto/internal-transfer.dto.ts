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

    // Use "-" symbol to determine "to" and "from" from "address" and "counterpartAddress" fields
    if (this.amount > 0) { // Transfer is incoming
      this.to = data.address
      this.from = data.counterpartAddress
    }
    if (this.amount < 0) { // Transfer is outgoing
      this.to = data.counterpartAddress!
      this.from = data.address
    }
  }
}
