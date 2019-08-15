import { Component, Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import { EthValue } from '@app/core/models'
import { eth } from '@app/core/helper'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

@Component
export class NumberFormatMixin extends Vue {

/*
===================================================================================
  Methods
===================================================================================
*/

  /* Non-formatted integers (Group I) */
  /* E.g. Block Number, Nonce */
  /* Are not formatted so no need for formatting method */

  /* Formatted integers (Group II) */

  formatIntegerValue(value: BigNumber): FormattedNumber {
    return NumberFormatHelper.formatIntegerValue(value)
  }

  /* Token Balances / Quantities (Group III) */

  formatFloatingPointValue(value: BigNumber): FormattedNumber {
    return NumberFormatHelper.formatFloatingPointValue(value)
  }

  /* Variable unit ETH values (Group IV) */

  formatVariableUnitEthValue(value: BigNumber, ethBreakpoint?: number, allowRounding?: boolean): FormattedNumber {
    return NumberFormatHelper.formatVariableUnitEthValue(value, ethBreakpoint, allowRounding)
  }

  /* Non-variable ETH values (Group V) */

  formatNonVariableEthValue(value: BigNumber, maxDecimalPlaces?: number): FormattedNumber {
    return NumberFormatHelper.formatNonVariableEthValue(value, maxDecimalPlaces)
  }

  /* Non-variable GWei values (Group VI) */

  formatNonVariableGWeiValue(value: BigNumber): FormattedNumber {
    return NumberFormatHelper.formatNonVariableGWeiValue(value)
  }

  /* Percentage values (Group VII) */

  formatPercentageValue(value: BigNumber): FormattedNumber {
    return NumberFormatHelper.formatPercentageValue(value)
  }

  /* USD values (Group VIII) */

  formatUsdValue(value: BigNumber): FormattedNumber {
    return NumberFormatHelper.formatUsdValue(value)
  }

}
