<template>
  <v-container pa-0 ma-0>
    <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
    <v-flex hidden-xs-only>
      <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
        <!-- Column 1 -->
        <v-flex xs12 md6>
          <v-flex d-flex xs12 pa-2>
            <v-layout row align-center justift-start pa-1>
              <v-flex shrink pl-0 pr-0 pt-1 pb-1>
                <p class="info--text pb-0 pl-0">{{ $tc('tx.hash', 1) }}:</p>
              </v-flex>
              <v-flex sm10 lg11 pa-1>
                <app-transform-hash :hash="transfer.transactionHash" :link="`/tx/${transfer.transactionHash}`"/>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 pa-2>
            <v-layout row align-center justify-space-around fill-height pa-1>
              <p class="info--text mb-0 mr-1">{{ $t('tx.from') }}:</p>
              <app-transform-hash :hash="transfer.from" :link="`/address/${transfer.from}`" :italic="true"/>
              <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
              <p class="info--text mb-0 mr-1" v-if="transfer.contract">{{ $tc('contract.name', 1) }}:</p>
              <p class="info--text mb-0 mr-1" v-else>{{ $t('tx.to') }}:</p>
              <app-transform-hash :hash="transfer.address" :link="`/address/${transfer.address}`" :italic="true" v-if="transfer.contract"/>
              <app-transform-hash :hash="transfer.to" :link="`/address/${transfer.to}`" :italic="true" v-else/>
            </v-layout>
          </v-flex>
        </v-flex>
        <!-- End Column 1 -->

        <!-- Column 2 -->
        <v-flex hidden-sm-and-down md2>
          <app-time-ago :timestamp="transfer.timestampDate"/>
        </v-flex>
        <!-- End Column 2 -->

        <!-- Column 3 -->
        <v-flex hidden-sm-and-down md2>
          <p>{{ calculateTransferValue(transfer.value) }}</p>
        </v-flex>
        <!-- End Column 3 -->

        <!-- Column 4 -->
        <v-flex v-if="isInternal" hidden-sm-and-down md2>
          <p>{{ $t('transfer.' + transfer.deltaType) }}</p>
        </v-flex>
        <!-- End Column 4 -->
      </v-layout>
      <v-divider class="mb-2 mt-2"/>
    </v-flex>
    <!--
    =====================================================================================
      Mobile (XS)
    =====================================================================================
    -->
    <v-flex xs12 hidden-sm-and-up>
      <div class="table-row-mobile">
        <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
          <v-flex xs2 pa-1 pb-2 pt-2>
            <p class="info--text pb-0">{{ $tc('tx.hash', 1) }}:</p>
          </v-flex>
          <v-flex xs10 pa-1 pb-2 pt-2>
            <app-transform-hash :hash="transfer.transactionHash" :link="`/tx/${transfer.transactionHash}`"/>
          </v-flex>
          <v-flex xs12 pa-1 pb-2 pt-2>
            <v-layout row pa-2>
              <p class="info--text pb-0 pr-1">{{ $tc('address.name', 2) }}:</p>
              <app-transform-hash :hash="transfer.from" :italic="true" :link="`/address/${transfer.from}`"/>
              <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
              <app-transform-hash v-if="transfer.contract" :hash="transfer.address" :italic="true" :link="`/address/${transfer.address}`"/>
              <app-transform-hash v-else :hash="transfer.to" :italic="true" :link="`/address/${transfer.to}`"/>
            </v-layout>
          </v-flex>
          <v-flex xs6 pa-0>
            <v-flex shrink pa-1 pb-2 pt-2>
              <p class="pb-0"><span class="info--text">{{ $t('common.quantity') }}:</span> {{ calculateTransferValue(transfer.value) }}</p>
            </v-flex>
          </v-flex>
          <v-flex xs6 pr-44>
            <v-layout row justify-end>
            <v-flex shrink pa-1 pb-2 pt-2>
              <p class="pb-0"><span class="info--text">{{ $t('token.type') }}:</span> {{ $t('transfer.' + transfer.deltaType) }}</p>
            </v-flex>
            </v-layout>
          </v-flex>

        </v-layout>
      </div>
      <v-divider class="mb-2 mt-2"/>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TransferPageExt_items } from '@app/core/api/apollo/extensions/transfer-page.ext'
import { EthValue } from '@app/core/models'
import BigNumber from 'bignumber.js'

@Component({
  components: {
    AppTimeAgo,
    AppTransformHash
  }
})
export default class TransfersTableRow extends Vue {
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

  calculateTransferValue(value: string) {
    if (this.isInternal) {
      return new EthValue(value).toEthFormatted().toString()
    }

    let n = new BigNumber(value)

    if (this.decimals) {
      n = n.div(new BigNumber(10).pow(this.decimals))
    }
    return n.toFormat(2).toString()
  }
}
</script>
<style scoped lang="css">
  .table-row-mobile {
    border: 1px solid #b4bfd2;
  }
</style>
