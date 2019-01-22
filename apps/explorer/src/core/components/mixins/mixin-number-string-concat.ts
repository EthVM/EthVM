import BN from 'bignumber.js'
import { Component, Vue } from 'vue-property-decorator'

@Component
export class StringConcatMixin extends Vue {
  // Methods
  getRoundNumber(newNumber, round = 2) {
    return new BN(newNumber).decimalPlaces(round).toString()
  }

  isShortValue(rawStr = ''): boolean {
    return rawStr.length < 10
  }

  getShortValue(rawStr): string {
    return this.isShortValue(rawStr) ? rawStr : rawStr.slice(0, 10) + '...'
  }
}
