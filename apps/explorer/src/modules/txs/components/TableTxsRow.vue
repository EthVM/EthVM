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
          <v-layout
            grid-list-xs
            row
            wrap
            align-center
            justify-start
            fill-height
            class="pt-3 pb-3 pr-3 pl-3"
          >
            <v-flex xs6 pa-1>
              <router-link
                class="black--text font-weight-medium pb-1"
                :to="`/block/${tx.blockHash}`"
              >{{ $t('block.number') }} {{ tx.blockNumberFormatted }}</router-link>
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
                <app-transform-hash
                  v-if="tx.isContractCreation"
                  :hash="tx.creates"
                  :italic="true"
                  :link="`/address/${tx.creates}`"
                />
                <app-transform-hash
                  v-else
                  :hash="tx.to"
                  :italic="true"
                  :link="`/address/${tx.to}`"
                />
              </v-layout>
            </v-flex>
            <v-flex shrink pa-1>
              <p class="info--text psmall">{{ $t('common.amount') }}:</p>
            </v-flex>
            <v-flex shrink pa-1>
              <p class="black--text align-center">
                {{ tx.valueFormatted.value }} {{ $t(`common.${tx.valueFormatted.unit}`) }}
                <app-tooltip
                  v-if="tx.valueFormatted.tooltipText"
                  :text="`${tx.valueFormatted.tooltipText} ${$t('common.eth')}`"
                />
              </p>
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
        <v-layout grid-list-xs row align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
          <!--
          =====================================================================================
            BLOCK NUMBER / HASH

            Responsive Tally:
            SM: 2/12 (2)
            MD: 1/12 (1)
            LG: 1/12 (1)
          =====================================================================================
          -->
          <v-flex sm2 lg1 pr-1>
            <router-link
              class="primary--text text-truncate font-italic psmall"
              :to="`/block/${tx.blockHash}`"
            >{{ tx.blockNumberFormatted }}</router-link>
          </v-flex>
          <!--
          =====================================================================================
            TRANSACTION # / HASH

            Responsive Tally:
            SM: 8/12 (6)
            MD: 6/12 (5)
            LG: 5/12 (4)
          =====================================================================================
          -->
          <v-flex sm7 md6 lg5>
            <v-layout row wrap align-center pa-2 mr-1>
              <v-flex sm12>
                <v-layout row align-center justift-start pa-2>
                  <p class="info--text tx-string">{{ $tc('tx.hash', 1) }}:</p>
                  <app-transform-hash :hash="tx.hash" :link="`/tx/${tx.hash}`" />
                </v-layout>
              </v-flex>
              <v-flex sm12>
                <v-layout row align-center justify-space-around fill-height pa-2>
                  <p class="info--text mr-1">{{ $t('tx.from') }}:</p>
                  <app-transform-hash :hash="tx.from" :link="`/address/${tx.from}`" :italic="true" />
                  <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                  <p
                    class="info--text mr-1"
                    v-if="tx.isContractCreation"
                  >{{ $tc('contract.name', 1) }}:</p>
                  <p class="info--text mr-1" v-else>{{ $t('tx.to') }}:</p>
                  <app-transform-hash
                    v-if="tx.isContractCreation"
                    :hash="tx.creates"
                    :link="`/address/${tx.creates}`"
                    :italic="true"
                  />
                  <app-transform-hash
                    v-else
                    :hash="tx.to"
                    :link="`/address/${tx.to}`"
                    :italic="true"
                  />
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <!--
          =====================================================================================
          ETH VALUE

          Responsive Tally:
          SM: 11/12 (3)
          MD: 9/12 (3)
          LG: 7/12 (2)
          =====================================================================================
          -->
          <v-flex sm3 md2>
            <p :class="[tx.successful ? 'txSuccess--text ' : 'txFail--text' ]">
              {{ tx.valueFormatted.value }} {{ $t(`common.${tx.valueFormatted.unit}`) }}
              <app-tooltip
                v-if="tx.valueFormatted.tooltipText"
                :text="`${tx.valueFormatted.tooltipText} ${$t('common.eth')}`"
              />
            </p>
          </v-flex>
          <!--
          =====================================================================================
            Age

            Responsive Tally:
            SM: 11/12 (0)
            MD: 11/12 (2)
            lg: 9/12 (2)
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
            MD: 11/12 (0)
            lg: 11/12 (2)
          =====================================================================================
          -->
          <v-flex hidden-md-and-down lg2>
            <p class="black--text text-truncate mb-0">{{ tx.feeFormatted.value }}</p>
          </v-flex>
          <!--
          =====================================================================================
          STATUS

          Responsive Tally:
            SM: 12/12 (1)
            MD: 12/12 (1)
            lg: 12/12 (1)
          =====================================================================================
          -->
          <div v-if="!isPending" class="tx-status ">
            <v-icon v-if="tx.successful" small class="txSuccess--text ml-1">fa fa-check-circle</v-icon>
            <v-icon v-else small class="txFail--text ml-1">fa fa-times-circle</v-icon>
          </div>
        </v-layout>
        <v-divider class="mb-2 mt-2" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import { TransactionSummaryPageExt_items } from '@app/core/api/apollo/extensions/transaction-summary-page.ext'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'

@Component({
  components: {
    AppTooltip,
    AppTimeAgo,
    AppTransformHash
  }
})
export default class TableTxsRow extends Vue {
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
.tx-string {
  min-width: 3em;
}

.tx-status {
  width: 45px;
}
</style>
