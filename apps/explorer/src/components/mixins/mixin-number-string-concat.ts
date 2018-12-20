import BN from 'bignumber.js'
export default {
  methods: {
    getRoundNumber(newNumber) {
      let n = new BN(newNumber)
      return n.decimalPlaces(2).toString()
    },
    getShortRewardValue(reward, isBool) {
      const length = reward.length
      let isShort = false
      if (length > 8) {
        reward = reward.slice(0, 8) + '...'
        isShort = true
      }
      if (!isBool) {
        return reward
      }
      return isShort
    }
  }
}
