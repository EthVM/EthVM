import { Uncle } from 'ethvm-common'

const toUncle = (uncle: any): Uncle => {
  uncle.number = uncle.number.bytes
  uncle.difficulty = uncle.difficulty.bytes
  uncle.gasLimit = uncle.gasLimit.bytes
  uncle.gasUsed = uncle.gasUsed.bytes
  return uncle
}

export { toUncle }
