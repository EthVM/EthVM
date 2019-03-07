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
  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getRoundNumber(newNumber): string {
    let round = 7
    if (newNumber > 1) {
      round = 2
    }
    return new BN(newNumber)
      .dp(round)
      .toFormat()
      .toString()
  }

  isShortValue(rawStr = ''): boolean {
    return rawStr.length < 10
  }

  getShortValue(rawStr): string {
    const _value = this.getRoundNumber(rawStr)
    return this.isShortValue(_value) ? _value : _value.slice(0, 10) + '...'
  }

  formatStr(rawStr): string {
    return new BN(rawStr).toFormat().toString()
  }

  getInt(newNum: number): string {
    return new BN(newNum)
      .dp(0, 6)
      .toFormat()
      .toString()
  }

  getPercent(newNum: number): string {
    return new BN(newNum).dp(2).toString()
  }
}
