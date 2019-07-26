import { BigNumber, DeltaType, Transfer } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TransferDto implements Transfer {

  id!: string;
  to!: string;
  deltaType!: DeltaType;
  from?: string;
  contractAddress?: string;
  tokenType?: string;
  amount: BigNumber;
  traceLocationBlockHash!: string;
  traceLocationBlockNumber!: BigNumber;
  traceLocationTransactionHash?: string;
  traceLocationTransactionIndex?: number;
  traceLocationLogIndex?: number;
  traceLocationTraceAddress?: string;
  timestamp!: Date;

  constructor(data: any) {
    assignClean(this, data)
  }
}
