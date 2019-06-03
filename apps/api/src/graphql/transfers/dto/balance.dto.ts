import { BigNumber, DeltaType, Balance } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class BalanceDto implements Balance {

  id!: string;
  address!: string;
  // counterpartAddress!: string;
  // deltaType!: DeltaType;
  contractAddress?: string;
  tokenType?: string;
  amount!: BigNumber;
  balance!: BigNumber;
  timestamp!: Date;
  // traceLocationBlockHash!: string;
  // traceLocationBlockNumber!: BigNumber;
  // traceLocationTransactionHash?: string;
  // traceLocationTransactionIndex?: number;
  // traceLocationLogIndex?: number;
  // traceLocationTraceAddress?: string;
  // timestamp!: number;

  constructor(data: any) {
    assignClean(this, data)
  }
}
