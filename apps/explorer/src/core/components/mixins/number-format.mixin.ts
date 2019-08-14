import { Component, Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import { EthValue } from '@app/core/models'

export enum EthUnit {
  ETH = 'Eth',
  GWEI = 'Gwei',
  WEI = 'Wei'
}

@Component
export class NumberFormatMixin extends Vue {

/*
===================================================================================
  Methods
===================================================================================
*/

  /* General numeric values */

  /**
   * Converts a general numeric value to a formatted string
   * @param value BigNumber
   * @returns formatted string
   */
  formatNumericValue(value: BigNumber): string {

    if (value.isGreaterThan(999999)) { // TODO review loss of accuracy
      return value.toFormat(0)
    }
    if (value.isGreaterThan(1)) {
      return value.toFormat(2) // TODO review loss of accuracy
    }
    if (value.isLessThan(0.0000001)) {
      return '< 0.0000001' // TODO review rules for this - string.length > 9 ?
    }
    return value.toFormat(7) // TODO review loss of accuracy
  }

  /**
   * Generates tooltip text for a general numeric value where applicable
   * @param value BigNumber
   * @returns formatted string or undefined
   */
  generateTooltipNumericValue(value: BigNumber): string | undefined {
    return value.isLessThan(0.0000001) ? value.toFormat() : undefined
  }


  /* Eth values */

  /**
   * Converts a value from wei to a formatted string in an appropriate unit
   * @param value BigNumber - must be original wei value (not already converted to Eth)
   * @returns Object { formatted: formatted string, unit: Eth, Gwei or Wei }
   */
  formatEthValue(value: BigNumber): {formatted: string, unit: EthUnit} {

    if (value.isGreaterThan(9999999999999)) {
      return { formatted: new EthValue(value).toEthFormatted().toString(), unit: EthUnit.ETH }
    }
    if (value.isGreaterThan(100000)) {
      return { formatted: new EthValue(value).toGWei().toString(), unit: EthUnit.GWEI }
    }
    return { formatted: value.toFormat(), unit: EthUnit.WEI }

  }

  /**
   * Generates tooltip text for an Eth value where applicable
   * @param value BigNumber - must be original wei value (not already converted to Eth)
   * @returns string containing value as Eth and unit, or undefined if value should be displayed in Eth
   */
  generateTooltipEthValue(value: BigNumber): string | undefined {
    return value.isLessThanOrEqualTo(9999999999) ? `${ new EthValue(value).toEthFormatted().toString()} ${EthUnit.ETH }` : undefined
  }


  /* USD values */

  /**
   * Converts a USD value to a formatted string
   * @param value: BigNumber
   * @returns formatted string
   */
  formatUsdValue(value: BigNumber): string {

    if (value.isGreaterThan(999999999)) {
      // TODO round to nearest billion or trillion
      return '1B'
    }
    if (value.isGreaterThanOrEqualTo(0.004)) {
      return value.toFormat(2)
    }
    if (value.isLessThan(0.0000001)) {
      return '< 0.0000001'
    }
    return value.toFormat(7) // TODO Confirm if this should only show as many decimal points as are present
  }

  /**
   * Generates tooltip text where applicable for a USD value
   * @param value: BigNumber
   */
  generateTooltipUsdValue(value: BigNumber): string | undefined {
    if (value.isLessThan(0.0000001)) {
      return value.toFormat()
    }
    if (value.isGreaterThan(999999999)) {
      return value.toFormat(0)
    }
  }

  /* Percentage values */

  /**
   * Converts a percentage value to a formatted string
   * @param value: number already converted to a percentage e.g. < 100 (expect in special cases)
   * @returns formatted string with "%" unit
   */
  formatPercentageValue(value: number): string {

    if (value < 0.01) {
      return '< 0.01%'
    }
    if (value > 100) {
      return '> 100%'
    }
    return `${new BigNumber(value).toFormat(2)}%`
  }

  /**
   * Generates tooltip text where applicable for a percentage value
   * @param value: number already converted to a percentage e.g. < 100 (expect in special cases)
   * @returns formatted string with "%" unit or undefined
   */
  generateTooltipPercentageValue(value: number): string | undefined {
    return value > 100 ? `${ new BigNumber(value).toFormat(2)}%` : undefined // TODO confirm dps
  }

}
