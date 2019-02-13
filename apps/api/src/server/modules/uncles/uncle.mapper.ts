import { Uncle } from 'ethvm-common'

const toUncle = (uncle: any): Uncle => {
  uncle.number = uncle.number.toString()
  uncle.difficulty = uncle.difficulty.toString()
  uncle.gasLimit = uncle.gasLimit.toString()
  uncle.gasUsed = uncle.gasUsed.toString()

  if (uncle.blockNumber) {
    uncle.blockNumber = uncle.blockNumber.toString()
  }

  if (uncle.uncleReward) {
    uncle.uncleReward = uncle.uncleReward.toString()
  }

  return uncle
}

export { toUncle }
