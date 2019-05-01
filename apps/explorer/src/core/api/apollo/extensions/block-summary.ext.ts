import {BlockSummary} from "@app/core/api/apollo/types/BlockSummary";
import BN from 'bignumber.js'

export class BlockSummaryExt implements BlockSummary {

  __typename!: "BlockSummary";
  author!: string | null;
  hash!: string | null;
  numTxs!: any | null
  numFailedTxs!: any | null;
  numSuccessfulTxs!: any | null;
  number!: any | null;
  reward!: any | null;
  uncleHashes!: (string | null)[] | null;
  difficulty!: any | null
  timestamp!: string | null
  transactionHashes!: (string | null)[] | null

  constructor(proto: any) {
    Object.assign(this, proto)
  }

  get numberBN(): BN | null {
    return this.number ? new BN(this.number, 16) : null
  }

  get numTxsBN(): BN | null{
    return this.numTxs ? new BN(this.numTxs, 16) : null
  }

  get numFailedTxsBN(): BN | null {
    return this.numFailedTxs ? new BN(this.numFailedTxs, 16) : null
  }

  get numSuccessfulTxsBN(): BN | null {
    return this.numSuccessfulTxs ? new BN(this.numSuccessfulTxs, 16) : null
  }

  get rewardBN(): BN | null {
    return this.reward ? new BN(this.reward, 16) : null
  }

  get difficultyBN(): BN | null {
    return this.difficulty ? new BN(this.difficulty) : null
  }

  get timestampDate(): Date | null {
    return this.timestamp ? new Date(+this.timestamp * 1000) : null
  }

}
