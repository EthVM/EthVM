import {BlockSummary} from "@app/core/api/apollo/types/BlockSummary";
import BN from 'bignumber.js'

export class BlockSummaryExt implements BlockSummary {

  __typename!: "BlockSummary";
  author!: string | null;
  hash!: string | null;
  numFailedTxs!: any | null;
  numSuccessfulTxs!: any | null;
  number!: any | null;
  reward!: any | null;
  uncleHashes!: (string | null)[] | null;


  constructor(proto: BlockSummary) {
    Object.assign(this, proto)
  }

  get numberBN(): BN {
    return new BN(this.number, 16)
  }

  get numFailedTxsBN(): BN {
    return new BN(this.numFailedTxs, 16)
  }

  get numSuccessfulTxsBN(): BN {
    return new BN(this.numSuccessfulTxs, 16)
  }

  get rewardBN(): BN {
    return this.reward ? new BN(this.reward, 16) : new BN(0)
  }

}
