import { UBigInt } from "@app/utils"

export class BlockRewardRecord {

  address: Buffer
  reward: Buffer

  constructor(props) {
    Object.assign(this, props)
  }

  get _reward(): BigInteger {
    return UBigInt(this.reward)
  }
}
