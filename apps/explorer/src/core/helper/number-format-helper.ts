import BigNumber from 'bignumber.js'
import { EthValue } from '@app/core/models'

export enum FormattedNumberUnit {
  ETH = 'eth',
  GWEI = 'gwei',
  WEI = 'wei',
  PERCENT = '%',
  USD = '$',
  B = 'B',
  T = 'T',
  Q = 'Q'
}

export interface FormattedNumber {
  value: string
  unit?: FormattedNumberUnit
  tooltipText?: string
}

const SmallUsdBreakpoint = 0.04
const SmallNumberBreakpoint = 0.0000001
const SmallGweiBreakpoint = 0.00001

const TenThousand = 10000
const OneMillion = 1000000
const HundredMillion = 100000000
const OneBillion = 1000000000
const HundredBillion = 1000000000
const OneTrillion = 1000000000000
const OneQuadrillion = 10000000000000000


export class NumberFormatHelper {
  /**
   * General: Non-formatted integers
   * E.g. Block Number, Nonce
   * Numbers that do nnot need  formating methods
   */

  /**
   * GROUP I: Formatted integers
   * Converts an integer value to a FormattedNumber object, returns value in billions if > 1 billion
   * @param value: BigNumber
   * @return FormattedNumber
   */
  public static formatIntegerValue(value: BigNumber): FormattedNumber {

    /* Case I: value >= 1,000,000,000,000,000 */
    if (value.isGreaterThanOrEqualTo(OneQuadrillion)) {
      return this.convertToQuadrillion(value)
    }

    /* Case II: value >= 1,000,000,000,000 */
    if (value.isGreaterThanOrEqualTo(OneTrillion)) {
      return this.convertToTrillions(value)
    }

    /* Case III: value >= 1,000,000,000 */
    if (value.isGreaterThanOrEqualTo(OneBillion)) {
      return this.convertToBillions(value)
    }

    /* Case IV: value < 1,000,000,000,000 */
    return { value: value.toFormat() }
  }

  /**
   * GROUP II: Floating point values
   * Converts a floating point value to a FormattedNumber object
   * Use cases: Token Balances / Quantities
   * @param value BigNumber
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatFloatingPointValue(value: BigNumber): FormattedNumber {

    const dps = value.decimalPlaces()

    /**
     * Case I: value === 0
     * Return: "0"
    */
    if (value.isZero()) {
      return { value: '0' }
    }

    /**
     * Case II: value >= 1,000,000,000
     * Return: formated integer value with tooltip
    */
    if (value.isGreaterThanOrEqualTo(OneBillion)) {
      return this.formatIntegerValue(value)
    }

    /**
     * Case III: value >= 1,000,000
     * Return: round number and tooltip with full value if there are decimal places
    */
    if (value.isGreaterThanOrEqualTo(OneMillion)) {
      return this.getRoundNumber(value, 0, dps)
    }

    /**
     * Case IV: value >= 1
     * Return: a number, rounded to 2 decimal points and tooltip with full value if > 2 decimal places
    */
    if (value.isGreaterThanOrEqualTo(1)) {
      return this.getRoundNumber(value, 2, dps)
    }

    /**
     * Case V: value >= 0.0000001
     * Return: a number, rounded up to 7 decimal places and tooltip with full value if > 7 decimal places
    */
    if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
      return this.getRoundNumber(value, 7, dps)
    }

    /**
     * Case V: value < 0.0000001
     * Return: string "< 0.0000001" and tooltip with full value
    */
    return { value: '< 0.0000001', tooltipText: value.toFormat() }
  }

  /**
   * GROUP III:  Variable unit ETH values
   * Converts a value from wei to a formatted string in an appropriate unit
   * @param value BigNumber - must be original wei value (not already converted to Eth)
   * @param isException boolean - if true follow special rounding rulles (use in Transaction's detail page)
   * @returns  Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatVariableUnitEthValue(value: BigNumber, isException: boolean = false): FormattedNumber {

    /**
     * Case I: value === 0
     * Return: "0 ETH"
    */
    if (value.isZero()) {
      return { value: '0', unit: FormattedNumberUnit.ETH }
    }

    /**
     * Case II: value >= 100,000,000,000 wei or value >= 0.0000001 Eth
     * Return: Group II formated number or follow rulles for exception
     */
    if (value.isGreaterThanOrEqualTo(HundredBillion)) {
      const ethBN = new EthValue(value).toEthBN()
      const dps = ethBN.decimalPlaces()
      return this.getEthValueForDetailsPage(ethBN, dps)
    }

    /**
     * Case III: value >= 10,000 wei or value >= 0.00001 Gwei
     * Return: medium values (>= 0.00001 GWEI) in GWEI with up to 7 decimal points and tooltip with ETH value
     */
    if (value.isGreaterThanOrEqualTo(TenThousand)) {
      const gweiBN = new EthValue(value).toGweiBN().decimalPlaces(7)
      return {
        value: gweiBN.toFormat(),
        unit: FormattedNumberUnit.GWEI,
        tooltipText: `${new EthValue(value).toEthBN().toFixed()}`
      }
    }

    /**
     * Case IV: value < 10,000 wei
     * Return: small values in WEI (no conversion) and tooltip with ETH value
    */
    return {
      value: value.toFormat(),
      unit: FormattedNumberUnit.WEI,
      tooltipText: `${new EthValue(value).toEthBN().toFixed()}`
    }
  }

  /**
   * GROUP IV: Non-variable ETH values
   * Convert a value in WEI to ETH
   * @param value: BigNumber (in wei)
   * @param allowRounding: whether or not to allow rounding
   * @return FormattedNumber with value converted to ETH and tooltip if maxDecimalPlaces was applied
   */
  public static formatNonVariableEthValue(value: BigNumber, isException: boolean = false): FormattedNumber {
    const ethBN = new EthValue(value).toEthBN()
    const unit = FormattedNumberUnit.ETH
    const dps = ethBN.decimalPlaces()

    /**
     * Case I: value === 0
     * Return: "0 ETH"
    */
    if (ethBN.isZero()) {
      return { value: '0', unit }
    }


    /**
     * Case II: details page
     * Return: return special case rounded number
    */
    if (isException) {
      return this.getEthValueForDetailsPage(ethBN, dps)
    }

    /**
     * Case III: x >= 1 Trillion
     * Return: formated integer number with tooltip"
    */
    if (ethBN.isGreaterThanOrEqualTo(OneBillion)) {
      return { ...this.formatIntegerValue(ethBN), unit: unit }
    }

    /**
     * Case IV: x >= 1 Million
     * Return: round number and tooltip if has decimal points
    */
    if (ethBN.isGreaterThanOrEqualTo(OneMillion)) {
      return { ...this.getRoundNumber(ethBN, 0, dps), unit: unit }
    }

    /**
     * Case V: x >= 1
     * Return: round number to 2 decimal points and tooltip if > 2 decimal points
    */
    if (ethBN.isGreaterThanOrEqualTo(1)) {
      return { ...this.getRoundNumber(ethBN, 2, dps), unit: unit }
    }

    /**
     * Case VI: 0 <= x <= 0.0000001
     * Return: round number upto 7 decimal points and tooltip if > 7 decimal points
    */
    if (ethBN.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
      return { ...this.getRoundNumber(ethBN, 7, dps), unit: unit }
    }

    /**
    * Case V: value < 0.0000001
    * Return: string "< 0.0000001" and tooltip with full value
   */
    return { value: '<0.0000001', unit, tooltipText: ethBN.toFormat() }
  }

  /**
   * GROUP V: Non-variable GWei values
   * Convert a value from WEI to GWEI
   * @param value BigNumber (in wei)
   * @return FormattedNumber with value in GWei and unit
   */
  public static formatNonVariableGWeiValue(value: BigNumber): FormattedNumber {
    const gweiBN = new EthValue(value).toGweiBN()
    const dps = gweiBN.decimalPlaces()

    /**
     * Case I: value === 0
     * Return: "0 ETH"
    */
    if (gweiBN.isZero()) {
      return { value: '0', unit: FormattedNumberUnit.GWEI }
    }

    /**
     * Case II: x < 0.00001
     * Return: number in wei and show tooltip with Gwei value
    */
    if (gweiBN.isLessThan(SmallGweiBreakpoint)) {
      return {
        value: value.toFormat(),
        unit: FormattedNumberUnit.WEI,
        tooltipText: `${gweiBN} ${FormattedNumberUnit.GWEI}`
      }
    }

    /**
     * Case III: x < 1 mill
     * Return: number in wei and show tooltip with Gwei value
    */

    if (gweiBN.isLessThan(OneMillion)) {
      return {
        value: gweiBN.toFormat(Math.min(7, dps)),
        unit: FormattedNumberUnit.GWEI,
        tooltipText: dps > 7 ? `${gweiBN.toFormat()} ${FormattedNumberUnit.GWEI}` : undefined
      }
    }

    /**
     * Case IV: x >= 1 mill
     * Return: number in wei and show tooltip with Gwei value
    */
    return {
      ... this.formatNonVariableEthValue(value, true), tooltipText: `${gweiBN.toFormat()} ${FormattedNumberUnit.GWEI}`
    }
  }

  /**
   * GROUP VI: Percentage values
   * Converts a percentage value to a FormattedNumber
   * @param value: BigNumber already converted to a percentage e.g. < 100 (expect in special cases)
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatPercentageValue(value: BigNumber | number): FormattedNumber {

    // Convert to BigNumber if necessary
    if (!(value instanceof BigNumber)) {
      value = new BigNumber(value)
    }
    const unit = FormattedNumberUnit.PERCENT

    /**
     * Case I: value === 0
     * Return: "0%"
    */
    if (value.isZero()) {
      return { value: '0', unit }
    }

    const isNegative = value.isNegative() // Record whether value is negative
    const positiveValue = isNegative ? value.negated() : value // Convert negative values to positive for comparisons
    const dps = value.decimalPlaces()

    /**
     * Case II: |value| >= 1000
     * Return: >1000 or <-1000 and tooltip
    */
    if (positiveValue.isGreaterThanOrEqualTo(1000)) {
      const result = isNegative ? '< -1000' : '> 1000'
      return { value: result, unit, tooltipText: `${value.toFormat()}%` }
    }

    /**
     * Case III: |value| >= 100
     * Return: whole number and tooltips if has decimal points
    */
    if (positiveValue.isGreaterThanOrEqualTo(100)) {
      return { value: value.toFormat(0), unit, tooltipText: dps ? `${value.toFormat()}%` : undefined }
    }

    /**
     * Case IV: |value| >= 0.01
     * Return: rounded to 2 decimal points number and tooltip if > 2 decimal points
    */
    if (positiveValue.isGreaterThanOrEqualTo(0.01)) {
      return {...this.getRoundNumber(value, 2, dps), unit, tooltipText: dps > 2 ? `${value.toFormat()}%` : undefined }
    }

    /**
     * Case V: If -0.01 < |value| < 0.01
     * Return: '>-0.01' '<0.01'r and tooltip
    */
    const result = isNegative ? '> -0.01' : '< 0.01'
    return { value: result, unit, tooltipText: `${value.toFormat()}%` }
  }

  /**
   * GROUP VII: USD Values
   * Converts a USD value to a FormattedNumber
   * @param value: BigNumber
   * @param allowRounding: whether or not to allow value to be rounded
   * @returns Object FormattedNumber with value as formatted string, unit and tooltipText
   */
  public static formatUsdValue(value: BigNumber, allowRounding: boolean = true): FormattedNumber {
    const unit = FormattedNumberUnit.USD
    /**
     * Case I: value === 0
     * Return: "$0.00"
    */
    if (value=== undefined || value.isZero()) {

      return { value: '$0.00', unit }
    }

    if (!allowRounding) {
      // Return value with all decimal places if rounding not allowed
      return { value: `${value.toFormat()}`, unit }
    }

    /**
     * Case II: value >= 1 Quadrillion
     * Return:  value converted to Quadrillions"
    */
    if (value.isGreaterThanOrEqualTo(OneQuadrillion)) {
      const result = this.convertToQuadrillion(value)
      return { ...result, value: `$${result.value}` }
    }


    /**
     * Case II: value >= 1 Trillion
     * Return:  value converted to trillions"
    */
    if (value.isGreaterThanOrEqualTo(OneTrillion)) {
      const result = this.convertToTrillions(value)
      return { ...result, value: `$${result.value}`, tooltipText: result.tooltipText ? `$${result.tooltipText}` : undefined }
    }

    /**
     * Case III: value >= 1 Billion
     * Return: value converted to billions"
    */
    if (value.isGreaterThanOrEqualTo(OneBillion)) {
      const result = this.convertToBillions(value)
      return { ...result, value: `$${result.value}`, tooltipText: result.tooltipText ? `$${result.tooltipText}` : undefined }
    }

    /**
     * Case IV: value >= 1 Million.
     * Return: rounded number and tolltip if has decimal points"
    */
    if (value.isGreaterThanOrEqualTo(OneMillion)) {
      const result = this.getRoundNumber(value, 0, value.decimalPlaces())
      return { ...result, value: `$${result.value}`, tooltipText: result.tooltipText ? `$${result.tooltipText}` : undefined }
    }

    /**
     * Case V: value > 0.04
     * Return: rounded number up to 2 decimal points and tolltip if > 2 decimal points"
    */
    if (value.isGreaterThan(SmallUsdBreakpoint)) {
      return { value: `$${value.toFormat(2)}`, unit, tooltipText: value.decimalPlaces() > 2 ? `$${value.toFormat()}` : undefined }
    }

    /**
     * Case VI: 0.0000001 <= value <= 0.04
     * Return: rounded number up to 7 decimal points and tooltip if > 7 decimal points"
    */
    if (value.isGreaterThanOrEqualTo(SmallNumberBreakpoint)) {
      const formatted = value.toFormat(Math.min(7, value.decimalPlaces()))
      return { value: `$${formatted}`, unit, tooltipText: value.decimalPlaces() > 7 ? `$${value.toFormat()}` : undefined }
    }

    /**
      * Case V: value < 0.0000001
      * Return: string "< $0.0000001" and tooltip with full value
    */
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

  private static convertToQuadrillion(value: BigNumber): FormattedNumber {
    const result = value.dividedBy(OneQuadrillion)
    return { value: '< 1000 Q', unit: FormattedNumberUnit.Q, tooltipText: value.toFormat() }
  }

  public static getRoundNumber(value: BigNumber, round: number, dp: number): FormattedNumber {
    return { value: value.toFormat(Math.min(round, dp)), tooltipText: dp > round ? value.toFormat() : undefined }
  }

  private static getEthValueForDetailsPage(ethBN: BigNumber, dps: number): FormattedNumber {
    /**
        * Case 1: 0.0000001 <= value < 1
        * Return: value rounded up to 12 decimal points and show tooltip if > 12 decimal points
      */

    if (ethBN.isLessThan(1)) {
      return { ...this.getRoundNumber(ethBN, 12, dps), unit: FormattedNumberUnit.ETH }
    }

    /**
      * Case 2: 1<= value < 100,000
      * Return: value rounded up to 6 decimal points and show tooltip if > 6 decimal points
    */
    if (ethBN.isLessThan(100000)) {
      return { ...this.getRoundNumber(ethBN, 6, dps), unit: FormattedNumberUnit.ETH }
    }

    /**
      * Case 3: 100,000 <= value < 100 mill
      * Return: value rounded up to 4 decimal points and show tooltip if > 4 decimal points
    */
    if (ethBN.isLessThan(HundredMillion)) {
      return { ...this.getRoundNumber(ethBN, 4, dps), unit: FormattedNumberUnit.ETH }
    }

    /**
      * Case 4: 100 mil <= value < 1 Trillion
      * Return: value rounded integer and show tooltip if has decimal points
    */
    if (ethBN.isLessThan(OneTrillion)) {
      return { ...this.getRoundNumber(ethBN, 0, dps), unit: FormattedNumberUnit.ETH }
    }

    /**
      * Case 5: 1value >= 1 Trillion
      * Return: formated large integer value
    */
    return { ...this.formatIntegerValue(ethBN), unit: FormattedNumberUnit.ETH }
  }

}
