<template>
  <v-container pa-0 ma-0>
    <v-layout d-block>
      <!--
      =====================================================================================
        Mobile (XS)
      =====================================================================================
      -->
      <v-flex xs12 hidden-sm-and-up>
        <div :class="txStatusClass">
          <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
            <v-flex xs6 pa-1>
              <router-link class="black--text font-weight-medium pb-1" :to="`/block/${tx.blockHash}`"
                >{{ $t('block.number') }} {{ tx.blockNumberBN }}</router-link
              >
            </v-flex>
            <v-flex xs6 pr-44>
              <v-layout row justify-end>
                <app-time-ago :timestamp="tx.timestampDate" />
              </v-layout>
            </v-flex>
            <v-flex xs2 pa-1>
              <p class="info--text psmall">{{ $tc('tx.hash', 1) }}:</p>
            </v-flex>
            <v-flex xs10 pa-1>
              <app-transform-hash :hash="tx.hash" :link="`/tx/${tx.hash}`" />
            </v-flex>
            <v-flex xs12 pa-1>
              <v-layout row pa-2>
                <p class="info--text psmall pr-1">{{ $tc('address.name', 2) }}:</p>
                <app-transform-hash :hash="tx.from" :italic="true" :link="`/address/${tx.from}`" />
                <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                <app-transform-hash v-if="tx.isContractCreation" :hash="tx.creates" :italic="true" :link="`/address/${tx.creates}`" />
                <app-transform-hash v-else :hash="tx.to" :italic="true" :link="`/address/${tx.to}`" />
              </v-layout>
            </v-flex>
            <v-flex shrink pa-1>
              <p class="info--text psmall">{{ $t('common.eth') }}:</p>
            </v-flex>
            <v-flex shrink pa-1>
              <p class="black--text align-center">{{ txValueFormatted.value }}</p>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <!--
      =====================================================================================
        Tablet/ Desktop (SM - XL)
      =====================================================================================
      -->
      <v-flex hidden-xs-only sm12>
        <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
          <!--
          =====================================================================================
            BLOCK NUMBER / HASH

            Responsive Tally:
            SM: 2/12 (2)
            MD: 1/12 (1)
          =====================================================================================
          -->
          <v-flex sm2 md1 pr-1>
            <router-link class="primary--text text-truncate font-italic psmall" :to="`/block/${tx.blockHash}`">{{ tx.blockNumberBN }}</router-link>
          </v-flex>
          <!--
          =====================================================================================
            TRANSACTION # / HASH

            Responsive Tally:
            SM: 9/12 (7)
            MD: 7/12 (6)
          =====================================================================================
          -->
          <v-flex d-flex sm7 md6 pr-3>
            <v-layout row wrap align-center pb-1>
              <v-flex sm12 pa-2>
                <v-layout row align-center justift-start pa-1>
                  <v-flex shrink pa-1>
                    <p class="info--text psmall">{{ $tc('tx.hash', 1) }}:</p>
                  </v-flex>
                  <v-flex sm10 pa-1>
                    <app-transform-hash :hash="tx.hash" :link="`/tx/${tx.hash}`" />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex sm12 pa-2>
                <v-layout row align-center justify-space-around fill-height pa-2>
                  <p class="info--text mb-0 mr-1">{{ $t('tx.from') }}:</p>
                  <app-transform-hash :hash="tx.from" :link="`/address/${tx.from}`" :italic="true" />
                  <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                  <p class="info--text mb-0 mr-1" v-if="tx.isContractCreation">{{ $tc('contract.name', 1) }}:</p>
                  <p class="info--text mb-0 mr-1" v-else>{{ $t('tx.to') }}:</p>
                  <app-transform-hash v-if="tx.isContractCreation" :hash="tx.creates" :link="`/address/${tx.creates}`" :italic="true" />
                  <app-transform-hash v-else :hash="tx.to" :link="`/address/${tx.to}`" :italic="true" />
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <!--
          =====================================================================================
          ETH VALUE

          Responsive Tally:
          SM: 11/12 (2)
          MD: 8/12 (1)
          =====================================================================================
          -->
          <v-flex d-flex sm2 md1 pr-0>
            <p :class="[tx.successful ? 'txSuccess--text mb-0' : 'txFail--text mb-0']">
              {{ txValueFormattedShort.value }}
              <app-tooltip v-if="txValueFormattedShort.tooltipText" :text="txValueFormattedShort.tooltipText" />
            </p>
          </v-flex>
          <!--
          =====================================================================================
            Age

            Responsive Tally:
            SM: 11/12 (0)
            MD: 11/12 (2)
          =====================================================================================
          -->
          <v-flex hidden-sm-and-down md2>
            <app-time-ago :timestamp="tx.timestampDate" />
          </v-flex>
          <!--
          =====================================================================================
            Tx Fee

            Responsive Tally:
            SM: 11/12 (0)
            MD: 9/12 (1)
          =====================================================================================
          -->
          <v-flex hidden-sm-and-down md1>
            <p class="black--text text-truncate mb-0">{{ txFeeFormatted.value }}</p>
          </v-flex>
          <!--
          =====================================================================================
          STATUS

          Responsive Tally:
          SM: 12/12 (1)
          MD: 12/12 (1)
          =====================================================================================
          -->
          <v-flex v-if="!isPending" sm1>
            <v-icon v-if="tx.successful" small class="txSuccess--text">fa fa-check-circle</v-icon>
            <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
          </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import { TransactionSummaryPageExt_items } from '@app/core/api/apollo/extensions/transaction-summary-page.ext'
import { FormattedNumber, NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'

@Component({
  components: {
    AppTooltip,
    AppTimeAgo,
    AppTransformHash
  }
})
export default class TableTxsRow extends Mixins(NumberFormatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) tx!: TransactionSummaryPageExt_items
  @Prop({ type: Boolean, default: false }) isPending

  /*
  ===================================================================================
   Computed
  ===================================================================================
  */

  get txStatusClass(): string {
    return this.tx.successful ? 'tx-status-sucess table-row-mobile' : 'tx-status-fail table-row-mobile'
  }

  get txValueFormatted(): FormattedNumber {
    return this.formatNonVariableEthValue(this.tx.valueBN)
  }

  get txValueFormattedShort(): FormattedNumber {
    return this.formatNonVariableEthValue(this.tx.valueBN, 2)
  }

  get txFeeFormatted(): FormattedNumber {
    return this.formatNonVariableEthValue(this.tx.feeBN)
  }
}
</script>

<style scoped lang="css">
.table-row-mobile {
  border: 1px solid #b4bfd2;
}

p {
  margin-bottom: 0px;
  padding-bottom: 0px;
}

.tx-status-fail {
  border-left: 2px solid #fe1377;
}

.tx-status-sucess {
  border-left: 2px solid #40ce9c;
}
</style>
