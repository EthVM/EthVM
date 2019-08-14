import { Component, Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import { EthValue } from '@app/core/models'

export enum FormattedNumberUnit {
  ETH = 'Eth',
  GWEI = 'Gwei',
  WEI = 'Wei',
  PERCENT = '%',
  USD = '$'
}

export interface FormattedNumber {
  value: string
  unit?: FormattedNumberUnit
  tooltipText?: string
}

const SmallUsdBreakpoint = 0.04
const SmallNumberBreakpoint = 0.0000001

const OneHundredThousand = 100000
const OneMillion = 1000000
const OneBillion = 1000000000
const OneTrillion = 1000000000000
const TenTrillion = 10000000000000

@Component
export class NumberFormatMixin extends Vue {

/*
===================================================================================
  Methods
===================================================================================
*/

  /* General numeric values */

  /**
   * Converts a general numeric value to a FormattedNumber object
   * @param value BigNumber
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  formatNumericValue(value: BigNumber): FormattedNumber {

    if (value.isGreaterThanOrEqualTo(OneMillion)) { // TODO review loss of accuracy
      return { value: value.toFormat(0) }
    }
    if (value.isGreaterThan(1)) { // TODO review loss of accuracy
      return { value: value.toFormat(2) }
    }
    if (value.isLessThan(SmallNumberBreakpoint)) { // TODO review rules for this - string.length > 9 ?
      return { value: '< 0.0000001', tooltipText: value.toFormat() }
    }
    return { value: value.toFormat(7) } // TODO review loss of accuracy
  }

  /* Eth values */

  /**
   * Converts a value from wei to a formatted string in an appropriate unit
   * @param value BigNumber - must be original wei value (not already converted to Eth)
   * @returns  Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  formatEthValue(value: BigNumber): FormattedNumber {

    if (value.isGreaterThanOrEqualTo(TenTrillion)) {
      return { value: new EthValue(value).toEthFormatted().toString(), unit: FormattedNumberUnit.ETH }
    }
    if (value.isGreaterThanOrEqualTo(OneHundredThousand)) {
      return {
        value: new EthValue(value).toGWei().toString(),
        unit: FormattedNumberUnit.GWEI,
        tooltipText: `${new EthValue(value).toEthFormatted().toString()} ${FormattedNumberUnit.ETH }`
      }
    }
    return {
      value: value.toFormat(),
      unit: FormattedNumberUnit.WEI,
      tooltipText: `${new EthValue(value).toEthFormatted().toString()} ${FormattedNumberUnit.ETH }`
    }
  }

  /* USD values */

  /**
   * Converts a USD value to a formatted string
   * @param value: BigNumber
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  formatUsdValue(value: BigNumber): FormattedNumber {

    const unit = FormattedNumberUnit.USD
    if (value.isGreaterThanOrEqualTo(OneTrillion)) { // 1 Trillion or greater
      return { value: `${value.dividedBy(OneTrillion).toFormat(0)}T`, unit, tooltipText: value.toFormat(0) }
    }
    if (value.isGreaterThanOrEqualTo(OneBillion)) { // 1 Billion or greater
      return { value: `${value.dividedBy(OneBillion).toFormat(0)}B`, unit,  tooltipText: value.toFormat(0) }
    }
    if (value.isGreaterThanOrEqualTo(SmallUsdBreakpoint)) { // 0.004 or greater
      return { value: value.toFormat(2), unit }
    }
    if (value.isLessThan(SmallNumberBreakpoint)) { // Less than 0.0000001
      return { value: '< 0.0000001', unit, tooltipText: value.toFormat() }
    }
    return { value: value.toFormat(7), unit } // TODO Confirm if this should only show as many decimal points as are present
  }

  /* Percentage values */

  /**
   * Converts a percentage value to a formatted string
   * @param value: BigNumber already converted to a percentage e.g. < 100 (expect in special cases)
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  formatPercentageValue(value: BigNumber): FormattedNumber {

    const unit = FormattedNumberUnit.PERCENT
    if (value.isLessThan(0.01)) {
      return { value: '< 0.01', unit }
    }
    if (value.isGreaterThan(100)) {
      return { value: '> 100%', unit, tooltipText: `${ new BigNumber(value).toFormat(2)}%` }
    }
    return { value: new BigNumber(value).toFormat(2), unit }
  }

}
