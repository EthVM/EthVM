import BN from 'bignumber.js'
import { Component, Vue } from 'vue-property-decorator'

@Component
export class StringConcatMixin extends Vue {
  // Methods
  getRoundNumber(newNumber, round) {
    if (!round) {
      round = 2
    }
    const n = new BN(newNumber)
    return n.decimalPlaces(round).toString()
  }

  getShortValue(newValue, isBool) {
    const length = newValue.length
    let isShort = false
    if (length > 10) {
      newValue = newValue.slice(0, 10) + '...'
      isShort = true
    }
    if (!isBool) {
      return newValue
    }
    return isShort
  }
}
