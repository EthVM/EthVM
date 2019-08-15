<template>
  <v-container pa-0 ma-0>
    <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
    <v-flex hidden-xs-only>
      <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
        <!-- Column 1: Tx Info -->
        <v-flex sm6 md7 :class="[$vuetify.breakpoint.name === 'sm' ? 'pr-3' : 'pr-5']">
          <v-layout row align-center justift-start pa-2>
            <p class="info--text tx-hash">{{ $tc('tx.hash', 1) }}:</p>
            <app-transform-hash :hash="transfer.transactionHash" :link="`/tx/${transfer.transactionHash}`" />
          </v-layout>
          <v-layout row align-center justify-space-around fill-height pa-2>
            <p class="info--text mr-1">{{ $t('tx.from') }}:</p>
            <app-transform-hash :hash="transfer.from" :link="`/address/${transfer.from}`" :italic="true" />
            <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
            <p class="info--text mr-1" v-if="transfer.contract">{{ $tc('contract.name', 1) }}:</p>
            <p class="info--text mr-1" v-else>{{ $t('tx.to') }}:</p>
            <app-transform-hash :hash="transfer.address" :link="`/address/${transfer.address}`" :italic="true" v-if="transfer.contract" />
            <app-transform-hash :hash="transfer.to" :link="`/address/${transfer.to}`" :italic="true" v-else />
          </v-layout>
        </v-flex>
        <!-- End Column 1 -->

        <!-- Column 2: Age -->
        <v-flex sm2>
          <app-time-ago :timestamp="transfer.timestampDate" />
        </v-flex>
        <!-- End Column 2 -->

        <!-- Column 3: Quantity -->
        <v-flex sm2>
          <p>
            {{ transferValue.value }}
          <v-tooltip v-if="transferValue.tooltipText" bottom>
            <template #activator="data">
              <v-icon v-on="data.on" dark small>fa fa-question-circle info--text</v-icon>
            </template>
            <span>{{ transferValue.tooltipText }} {{ $t('common.eth') }}</span>
          </v-tooltip>
          </p>
        </v-flex>
        <!-- End Column 3 -->

        <!-- Column 4: Type -->
        <v-flex v-if="isInternal" sm2 md1>
          <p>{{ $t('transfer.' + transfer.deltaType) }}</p>
        </v-flex>
        <!-- End Column 4 -->
      </v-layout>
      <v-divider class="mb-2 mt-2" />
    </v-flex>
    <!--
    =====================================================================================
      Mobile (XS)
    =====================================================================================
    -->
    <v-flex xs12 hidden-sm-and-up>
      <div class="table-row-mobile mb-2">
        <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
          <v-flex xs7>
            <app-time-ago :timestamp="transfer.timestampDate" />
          </v-flex>
          <v-flex xs5>
            <p class="info--text text-xs-right">
              {{ $t('token.type') }}: <span class="black--text">{{ $t('transfer.' + transfer.deltaType) }}</span>
            </p>
          </v-flex>
          <v-flex xs12>
            <v-layout row pa-2>
              <p class="info--text tx-hash">{{ $tc('tx.hash', 1) }}:</p>
              <app-transform-hash :hash="transfer.transactionHash" :link="`/tx/${transfer.transactionHash}`" />
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout row pa-2>
              <p class="info--text pr-1">{{ $tc('address.name', 2) }}:</p>
              <app-transform-hash :hash="transfer.from" :italic="true" :link="`/address/${transfer.from}`" />
              <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
              <app-transform-hash v-if="transfer.contract" :hash="transfer.address" :italic="true" :link="`/address/${transfer.address}`" />
              <app-transform-hash v-else :hash="transfer.to" :italic="true" :link="`/address/${transfer.to}`" />
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <p class="pb-0">
              <span class="info--text">{{ $t('common.quantity') }}:</span> {{ transferValue.value }}
              <v-tooltip v-if="transferValue.tooltipText" bottom>
                <template #activator="data">
                  <v-icon v-on="data.on" dark small>fa fa-question-circle info--text</v-icon>
                </template>
                <span>{{ transferValue.tooltipText }} {{ $t('common.eth') }}</span>
              </v-tooltip>
            </p>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { TransferPageExt_items } from '@app/core/api/apollo/extensions/transfer-page.ext'
import { EthValue } from '@app/core/models'
import BigNumber from 'bignumber.js'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'

@Component({
  components: {
    AppTimeAgo,
    AppTransformHash
  }
})
export default class TransfersTableRow extends Mixins(NumberFormatMixin) {
  /*
   ===================================================================================
     Props
   ===================================================================================
   */
  @Prop(TransferPageExt_items) transfer!: TransferPageExt_items
  @Prop(Boolean) isInternal?: boolean
  @Prop(Number) decimals?: number

  /*
    ===================================================================================
      Methods
    ===================================================================================
    */

  get transferValue(): FormattedNumber {
    let n = this.transfer.valueBN || new BigNumber(0)

    if (this.isInternal) {
      return this.formatNonVariableEthValue(n, 7)
    }

    // Must be a token transfer

    if (this.decimals) {
      n = n.div(new BigNumber(10).pow(this.decimals))
    }
    return this.formatFloatingPointValue(n)
  }
}
</script>
<style scoped lang="css">
.table-row-mobile {
  border: 1px solid #b4bfd2;
}

.tx-hash {
  min-width: 3em;
}
</style>
