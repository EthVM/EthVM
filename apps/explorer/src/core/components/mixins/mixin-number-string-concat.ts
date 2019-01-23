import BN from 'bignumber.js'
import { Component, Vue } from 'vue-property-decorator'

const format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3
}
BN.config({ FORMAT: format })

@Component
export class StringConcatMixin extends Vue {
  // Methods
  getRoundNumber(newNumber, round = 2) {
    return new BN(newNumber)
      .decimalPlaces(round)
      .toFormat()
      .toString()
  }

  isShortValue(rawStr = ''): boolean {
    return rawStr.length < 10
  }

  getShortValue(rawStr): string {
    const _value = this.getRoundNumber(rawStr, 3)
    return this.isShortValue(_value) ? _value : _value.slice(0, 10) + '...'
  }
  formatStr(rawStr): string {
    return new BN(rawStr).toFormat().toString()
  }
}
