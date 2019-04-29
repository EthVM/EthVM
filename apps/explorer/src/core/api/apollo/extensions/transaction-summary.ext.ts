import BN from 'bignumber.js'
import {TransactionSummary} from "@app/core/api/apollo/types/TransactionSummary";
import {Hex} from "@app/core/models";

export class TransactionSummaryExt implements TransactionSummary {

  __typename!: "TransactionSummary";
  blockNumber!: any | null;
  transactionIndex!: number | null;
  creates!: string | null;
  contractName!: string | null;
  contractSymbol!: string | null;
  fee!: any | null;
  from!: string | null;
  hash!: string | null;
  successful!: boolean | null;
  timestamp!: string | null;
  to!: string | null;
  value!: any | null;

  constructor(proto: TransactionSummary) {
    Object.assign(this, proto)
  }

  get blockNumberBN(): BN {
    return new BN(this.blockNumber, 16)
  }

  get fromHex(): Hex {
    return new Hex(this.from || '')
  }

  get toHex(): Hex {
    return new Hex(this.to || '')
  }

  get createsHex(): Hex {
    return new Hex(this.creates || '')
  }

  get feeBN(): BN {
    return new BN(this.fee, 16)
  }

  get valueBN(): BN {
    return new BN(this.value, 16)
  }

  get isContractCreation(): boolean {
    return !!this.creates && this.creates !== ''
  }

  get timestampDate(): Date | null {
    return this.timestamp ? new Date(+this.timestamp * 1000) : null
  }
}
