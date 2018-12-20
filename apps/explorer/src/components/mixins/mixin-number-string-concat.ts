import BN from 'bignumber.js'
export default {
  methods: {
    getRoundNumber(newNumber, round) {
      if (!round) {
        round = 2
      }
      let n = new BN(newNumber)
      return n.decimalPlaces(round).toString()
    },
    getShortValue(newValue, isBool) {
      const length = newValue.length
      let isShort = false
      if (length > 8) {
        newValue = newValue.slice(0, 8) + '...'
        isShort = true
      }
      if (!isBool) {
        return newValue
      }
      return isShort
    }
  }
}
