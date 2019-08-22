import BigNumber from 'bignumber.js'
import { EthValue } from '@app/core/models'

export enum FormattedNumberUnit {
  ETH = 'eth',
  GWEI = 'gwei',
  WEI = 'wei',
  PERCENT = '%',
  USD = '$',
  B = 'B',
  T = 'T'
}

export interface FormattedNumber {
  value: string
  unit?: FormattedNumberUnit
  tooltipText?: string
}

const SmallUsdBreakpoint = 0.04
const SmallNumberBreakpoint = 0.0000001
const SmallEthBreakpoint = 0.00001

const TenThousand = 10000
const OneMillion = 1000000
const OneBillion = 1000000000
const OneTrillion = 1000000000000
const TenTrillion = 10000000000000

export class NumberFormatHelper {
  /* Non-formatted integers (Group I) */
  /* E.g. Block Number, Nonce */
  /* Are not formatted so no need for formatting method */

  /* Formatted integers (Group II) */

  /**
   * Converts an integer value to a FormattedNumber object, returns value in billions if > 1 billion
   * @param value: BigNumber
   * @param allowBillions: whether or not number should be converted to billuons
   * @return FormattedNumber
   */
  public static formatIntegerValue(value: BigNumber, allowBillions: boolean = true): FormattedNumber {
    if (value.isGreaterThanOrEqualTo(OneTrillion)) {
      return this.convertToTrillions(value)
    }
    if (value.isGreaterThanOrEqualTo(OneBillion)) {
      return this.convertToBillions(value)
    }
    return { value: value.toFormat() }
  }

  /* Token Balances / Quantities (Group III) */

  /**
   * Converts a floating point value to a FormattedNumber object
   * @param value BigNumber
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatFloatingPointValue(value: BigNumber): FormattedNumber {
    if (value.isZero()) {
      return { value: '0' }
    }
    if (value.isGreaterThanOrEqualTo(OneTrillion)) {
      return this.convertToTrillions(value)
    }
    if (value.isGreaterThan(OneBillion)) {
      return this.convertToBillions(value)
    }
    if (value.isGreaterThanOrEqualTo(OneMillion)) {
      // show round number and tooltip with full value if there are decimal places
      return { value: value.toFormat(0), tooltipText: value.decimalPlaces() ? value.toFormat() : undefined }
    }
    if (value.isGreaterThan(1)) {
      // show max 2 decimal places and tooltip with full value if > 2 decimal places
      const dps = value.decimalPlaces()
      return { value: value.toFormat(Math.min(2, dps)), tooltipText: dps > 2 ? value.toFormat() : undefined }
    }
    if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
      // show up to 7 decimal places and tooltip with full value if > 7 decimal places
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
    if (value.isZero()) {
      // Return "0 ETH" if value is 0
      return { value: '0', unit: FormattedNumberUnit.ETH }
    }

    if (value.isGreaterThanOrEqualTo(ethBreakpoint)) {
      // Show large values in ETH, no tooltip
      const ethBN = new BigNumber(new EthValue(value).toEth())
      if (allowRounding) {
        // follow rules of floating point formatting
        const formatted = this.formatFloatingPointValue(ethBN)
        return { ...formatted, unit: FormattedNumberUnit.ETH }
      }
      return { value: ethBN.toFormat(), unit: FormattedNumberUnit.ETH }
    }
    if (value.isGreaterThanOrEqualTo(TenThousand)) {
      // Show medium values (>= 0.00001 GWEI) in GWEI, with tooltip with ETH value
      const gweiBN = new BigNumber(new EthValue(value).toGWei())
      const dps = allowRounding && gweiBN.decimalPlaces() > 7 ? 7 : undefined // Round to 7 dps if applicable
      return {
        value: gweiBN.toFormat(dps),
        unit: FormattedNumberUnit.GWEI,
        tooltipText: `${new EthValue(value).toEth().toString()}`
      }
    }
    // Show small values in WEI (no conversion) with tooltip with ETH value
    return {
      value: value.toFormat(),
      unit: FormattedNumberUnit.WEI,
      tooltipText: `${new EthValue(value).toEthBN().toFixed()}`
    }
  }

  /* Non-variable ETH values (Group V) */

  /**
   * Convert a value in WEI to ETH
   * @param value: BigNumber (in wei)
   * @param allowRounding: whether or not to allow rounding
   * @return FormattedNumber with value converted to ETH and tooltip if maxDecimalPlaces was applied
   */
  public static formatNonVariableEthValue(value: BigNumber, allowRounding: boolean = true): FormattedNumber {
    const ethBN = new BigNumber(new EthValue(value).toEthBN())
    const unit = FormattedNumberUnit.ETH

    if (ethBN.isZero()) {
      return { value: '0', unit }
    }

    // Return full number formatted if rounding is not allowed
    if (!allowRounding) {
      return { value: ethBN.toFormat(), unit }
    }
    const dps = ethBN.decimalPlaces()
    if (ethBN.isGreaterThanOrEqualTo(OneTrillion)) {
      // Convert to trillions if greater than 1 trillion
      return { ...this.convertToTrillions(value), unit }
    }
    if (ethBN.isGreaterThanOrEqualTo(OneBillion)) {
      // Convert to billions if greater than 1 billion
      return { ...this.convertToBillions(ethBN), unit }
    }
    if (ethBN.isGreaterThanOrEqualTo(OneMillion)) {
      // Show round number if greater than 1 million
      return { value: ethBN.toFormat(0), unit, tooltipText: dps ? ethBN.toFormat() : undefined }
    }
    if (ethBN.isGreaterThanOrEqualTo(1)) {
      // Show up to 2 decimal places if greater than 1
      return { value: ethBN.toFormat(Math.min(2, dps)), unit, tooltipText: dps > 2 ? ethBN.toFormat() : undefined }
    }
    if (ethBN.isGreaterThanOrEqualTo(SmallEthBreakpoint)) {
      // Show up to 7 decimal places
      return {
        value: ethBN.toFormat(Math.min(7, ethBN.decimalPlaces())),
        unit,
        tooltipText: ethBN.decimalPlaces() > dps ? ethBN.toFormat() : undefined
      }
    }
    // Value is less than 0.00001
    return { value: '<0.00001', unit, tooltipText: ethBN.toFormat() }
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
  public static formatPercentageValue(value: BigNumber | number): FormattedNumber {
    if (!(value instanceof BigNumber)) {
      // Convert to BigNumber if necessary
      value = new BigNumber(value)
    }
    const unit = FormattedNumberUnit.PERCENT

    if (value.isZero()) {
      return { value: '0', unit }
    }

    const isNegative = value.isNegative() // Record whether value is negative
    const positiveValue = isNegative ? value.negated() : value // Convert negative values to positive for comparisons
    const dps = value.decimalPlaces()

    if (positiveValue.isGreaterThanOrEqualTo(1000)) {
      // Display >1000 or <-1000
      const result = isNegative ? '<-1000' : '>1000'
      return { value: result, unit, tooltipText: `${value.toFormat()}%` }
    }
    if (positiveValue.isGreaterThanOrEqualTo(100)) {
      // Display whole number
      return { value: value.toFormat(0), unit, tooltipText: dps ? `${value.toFormat()}%` : undefined }
    }
    if (positiveValue.isGreaterThanOrEqualTo(0.01)) {
      // Display up to 2 decimal places
      return { value: value.toFormat(2), unit, tooltipText: dps > 2 ? `${value.toFormat()}%` : undefined }
    }
    // If -0.01 < x < 0.01
    const result = isNegative ? '>-0.01' : '<0.01'
    return { value: result, unit, tooltipText: `${value.toFormat()}%` }
  }

  /* USD values (Group VIII) */

  /**
   * Converts a USD value to a FormattedNumber
   * @param value: BigNumber
   * @param allowRounding: whether or not to allow value to be rounded
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatUsdValue(value: BigNumber, allowRounding: boolean = true): FormattedNumber {
    const unit = FormattedNumberUnit.USD

    if (value.isZero()) {
      return { value: '$0.00', unit }
    }

    if (!allowRounding) {
      // Return value with all decimal places if rounding not allowed
      return { value: `${value.toFormat()}`, unit }
    }
    if (value.isGreaterThanOrEqualTo(OneTrillion)) {
      // 1 Trillion or greater convert to trillions
      const result = this.convertToTrillions(value)
      return { ...result, value: `$${result.value}` }
    }
    if (value.isGreaterThanOrEqualTo(OneBillion)) {
      // 1 Billion or greater convert to billions
      const result = this.convertToBillions(value)
      return { ...result, value: `$${result.value}` }
    }
    if (value.isGreaterThanOrEqualTo(SmallUsdBreakpoint)) {
      // 0.004 or greater show 2 decimal places
      return { value: `$${value.toFormat(2)}`, unit, tooltipText: value.decimalPlaces() > 2 ? `$${value.toFormat()}` : undefined }
    }
    if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
      // 0.0000001 or greater show up to 7 decimals places
      const formatted = value.toFormat(Math.min(7, value.decimalPlaces()))
      return { value: `$${formatted}`, unit, tooltipText: value.decimalPlaces() > 7 ? `$${value.toFormat()}` : undefined }
    }
    // Less than 0.0000001
    return { value: '< $0.0000001', unit, tooltipText: `$${value.toFixed()}` }
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

  private static convertToTrillions(value: BigNumber): FormattedNumber {
    const result = value.dividedBy(OneTrillion)
    return {
      value: `${result.toFormat(Math.min(3, result.decimalPlaces()))}T`,
      unit: FormattedNumberUnit.T,
      tooltipText: value.toFormat()
    }
  }
}
