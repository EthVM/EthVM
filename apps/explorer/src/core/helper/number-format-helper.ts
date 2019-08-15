import BigNumber from 'bignumber.js'
import { EthValue } from '@app/core/models'

export enum FormattedNumberUnit {
  ETH = 'eth',
  GWEI = 'gwei',
  WEI = 'wei',
  PERCENT = '%',
  USD = '$',
  B = 'B'
}

export interface FormattedNumber {
  value: string
  unit?: FormattedNumberUnit
  tooltipText?: string
}

const SmallUsdBreakpoint = 0.04
const SmallNumberBreakpoint = 0.0000001

const TenThousand = 10000
const OneMillion = 1000000
const OneBillion = 1000000000
const TenTrillion = 10000000000000

export class NumberFormatHelper {

  /* Non-formatted integers (Group I) */
  /* E.g. Block Number, Nonce */
  /* Are not formatted so no need for formatting method */


  /* Formatted integers (Group II) */

  /**
   * Converts an integer value to a FormattedNumber object, returns value in billions if > 1 billion
   * @param value: BigNumber
   * @return FormattedNumber
   */
  public static formatIntegerValue(value: BigNumber): FormattedNumber {

    if (value.isLessThan(OneBillion)) {
      return { value: value.toFormat() }
    }
    // Convert numbers >= 1 billion to billions (with max 3 decimal places)
    return this.convertToBillions(value)
  }

  /* Token Balances / Quantities (Group III) */

  /**
   * Converts a floating point value to a FormattedNumber object
   * @param value BigNumber
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatFloatingPointValue(value: BigNumber): FormattedNumber {

    if (value.isGreaterThan(OneBillion)) { // convert value to billions
      return this.convertToBillions(value)
    }
    if (value.isGreaterThanOrEqualTo(OneMillion)) { // show round number and tooltip with full value if there are decimal places
      return { value: value.toFormat(0), tooltipText: value.decimalPlaces() ? value.toFormat() : undefined }
    }
    if (value.isGreaterThan(1)) { // show 2 decimal places and tooltip with full value if > 2 decimal places
      return { value: value.toFormat(2), tooltipText: value.decimalPlaces() > 2 ? value.toFormat() : undefined }
    }
    if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) { // show up to 7 decimal places and tooltip with full value if > 7 decimal places
      const dps = value.decimalPlaces()
      return { value: value.toFormat(Math.min(7, dps)), tooltipText: dps > 7 ? value.toFormat() : undefined }
    }
    // Very small numbers: show "< 0.0000001" and tooltip with full value
    return { value: '< 0.0000001', tooltipText: value.toFormat() }
  }

  /* Variable unit ETH values (Group IV) */

  /**
   * Converts a value from wei to a formatted string in an appropriate unit
   * @param value BigNumber - must be original wei value (not already converted to Eth)
   * @param ethBreakpoint number - point at or greater than which value should be converted to Eth, default = ten trillion (0.00001 ETH)
   * @param allowRounding boolean - whether or not maximum of 7 decimal points should be set
   * @returns  Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatVariableUnitEthValue(value: BigNumber, ethBreakpoint: number = TenTrillion, allowRounding?: boolean): FormattedNumber {

    if (value.isGreaterThanOrEqualTo(ethBreakpoint)) { // Show large values in ETH, no tooltip
      const ethBN = new BigNumber(new EthValue(value).toEth())
      if (allowRounding) { // follow rules of floating point formatting
        const formatted = this.formatFloatingPointValue(ethBN)
        return {...formatted, unit: FormattedNumberUnit.ETH}
      }
      return { value: ethBN.toFormat(), unit: FormattedNumberUnit.ETH }
    }
    if (value.isGreaterThanOrEqualTo(TenThousand)) { // Show medium values (>= 0.00001 GWEI) in GWEI, with tooltip with ETH value
      const gweiBN = new BigNumber(new EthValue(value).toGWei())
      const dps = allowRounding && gweiBN.decimalPlaces() > 7 ? 7 : undefined // Round to 7 dps if applicable
      return {
        value: gweiBN.toFormat(dps), unit: FormattedNumberUnit.GWEI, tooltipText: `${new EthValue(value).toEth().toString()}`
      }
    }
    // Show small values in WEI (no conversion) with tooltip with ETH value
    return {
      value: value.toFormat(),
      unit: FormattedNumberUnit.WEI,
      tooltipText: `${ new EthValue(value).toEthBN().toFixed() }`
    }
  }

  /* Non-variable ETH values (Group V) */

  /**
   * Convert a value in WEI to ETH
   * @param value: BigNumber (in wei)
   * @param maxDecimalPlaces: number
   * @return FormattedNumber with value converted to ETH and tooltip if maxDecimalPlaces was applied
   */
  public static formatNonVariableEthValue(value: BigNumber, maxDecimalPlaces?: number): FormattedNumber {

    const ethBN = new BigNumber(new EthValue(value).toEth())
    const dps = maxDecimalPlaces && ethBN.decimalPlaces() > maxDecimalPlaces ? maxDecimalPlaces : undefined // Set max decimals for formatting
    return {
      value: ethBN.toFormat(dps),
      unit: FormattedNumberUnit.ETH,
      tooltipText: dps ? ethBN.toFormat() : undefined
    }
  }

  /* Non-variable GWei values (Group VI) */

  /**
   * Convert a value from WEI to GWEI
   * @param value BigNumber (in wei)
   * @return FormattedNumber with value in GWei and unit
   */
  public static formatNonVariableGWeiValue(value: BigNumber): FormattedNumber {
    return { value: new EthValue(value).toGWei().toString(), unit: FormattedNumberUnit.GWEI }
  }

  /* Percentage values (Group VII) */

  /**
   * Converts a percentage value to a FormattedNumber
   * @param value: BigNumber already converted to a percentage e.g. < 100 (expect in special cases)
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatPercentageValue(value: BigNumber): FormattedNumber {

    const unit = FormattedNumberUnit.PERCENT
    if (value.isLessThan(0.01)) {
      return { value: '< 0.01', unit }
    }
    if (value.isGreaterThan(100)) {
      return { value: '> 100%', unit, tooltipText: `${ new BigNumber(value).toFormat(2)}%` }
    }
    return { value: new BigNumber(value).toFormat(2), unit }
  }

  /* USD values (Group VIII) */

  /**
   * Converts a USD value to a FormattedNumber
   * @param value: BigNumber
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatUsdValue(value: BigNumber): FormattedNumber {

    const unit = FormattedNumberUnit.USD
    if (value.isGreaterThanOrEqualTo(OneBillion)) { // 1 Billion or greater convert to billions
      return this.convertToBillions(value)
    }
    if (value.isGreaterThanOrEqualTo(SmallUsdBreakpoint)) { // 0.004 or greater show 2 dps
      return { value: value.toFormat(2), unit, tooltipText: value.decimalPlaces() > 2 ? value.toFormat() : undefined }
    }
    if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) { // 0.0000001 or greater show 7 dps
      const dps = value.decimalPlaces()
      return { value: value.toFormat(Math.min(7, dps)), unit, tooltipText: dps > 7 ? value.toFormat() : undefined  }
    }
    // Less than 0.0000001
    return { value: '< $0.0000001', unit, tooltipText: value.toFixed() }
  }

  /* Helper functions */

  private static convertToBillions(value: BigNumber): FormattedNumber {
    const result = value.dividedBy(OneBillion)
    return {
      value: `${result.toFormat(Math.min(3, result.decimalPlaces()))}B`,
      unit: FormattedNumberUnit.B,
      tooltipText: value.toFormat()
    }
  }
}
