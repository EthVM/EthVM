import BN from 'bignumber.js'
export default {
  methods: {
    getRoundNumber(newNumber) {
      let n = new BN(newNumber)
      return n.decimalPlaces(2).toString()
    },
    getShortRewardValue(newRewardValue, isBool) {
      const length = newRewardValue.length
      let isShort = false
      if (length > 8) {
        newRewardValue = newRewardValue.slice(0, 8) + '...'
        isShort = true
      }
      if (!isBool) {
        return newRewardValue
      }
      return isShort
    }
  }
}
