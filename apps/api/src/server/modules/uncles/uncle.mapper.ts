import { Uncle } from 'ethvm-common'

const toUncle = (uncle: any): Uncle => {
  uncle.number = uncle.number.toString()
  uncle.difficulty = uncle.difficulty.toString()
  uncle.gasLimit = uncle.gasLimit.toString()
  uncle.gasUsed = uncle.gasUsed.toString()
  return uncle
}

export { toUncle }
