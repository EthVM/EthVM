<template>
  <div>
    <!-- Pagination -->
    <v-layout row fill-height justify-end class="pb-1 pr-2 pl-2" v-if="numPages > 1">
      <app-paginate :total="numPages" @newPage="setPage" :current-page="page" />
    </v-layout>
    <!-- End Pagination -->

    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm8 md5>
          <h5>{{ $tc('tx.hash', 1) }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('common.age') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('common.quantity') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->

    <!-- Start Rows -->
    <v-card v-if="totalTransfers === 0" flat>
      <v-card-text class="text-xs-center secondary--text">{{ $t('transfer.empty') }}</v-card-text>
    </v-card>
    <v-card color="white" v-for="(tx, index) in transfers" class="transparent" flat :key="`${index}-${tx.transactionHash}`">
      <v-layout align-center justify-start row fill-height pr-3>
        <!-- Column 1 -->
        <v-flex xs6 sm8 md5>
          <v-flex d-flex xs12 pb-2>
            <router-link class="primary--text text-truncate font-italic psmall" :to="`/tx/${tx.transactionHash}`">{{ tx.transactionHash }}</router-link>
          </v-flex>
          <v-flex xs12 pt-0>
            <v-layout row pl-2>
              <p class="text-truncate info--text mb-0">
                {{ $t('tx.from') }}:
                <router-link :to="`/address/${tx.from}`" class="secondary--text font-italic font-weight-regular">
                  {{ tx.from }}
                </router-link>
              </p>
              <v-icon class="fas fa-arrow-right primary--text pl-1 pr-2 pb-1" small></v-icon>
              <p class="text-truncate info--text font-weight-thin mb-0">
                <strong>{{ $t('tx.to') }}:</strong>
                <router-link class="secondary--text font-italic font-weight-regular" :to="`/address/${tx.to}`">
                  {{ tx.to }}
                </router-link>
              </p>
            </v-layout>
          </v-flex>
        </v-flex>
        <!-- End Column 1 -->

        <!-- Column 2 -->
        <v-flex hidden-sm-and-down md2>
          <app-time-ago :timestamp="formatTimestamp(tx.timestamp)" />
        </v-flex>
        <!-- End Column 2 -->

        <!-- Column 3 -->
        <v-flex hidden-sm-and-down md2>
          <p>{{ calculateTransferValue(tx.value) }}</p>
        </v-flex>
        <!-- End Column 3 -->
      </v-layout>
      <v-divider class="mb-2 mt-2" />
    </v-card>
    <!-- End Rows -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Transfer, Tx } from '@app/core/models'
import BN from 'bignumber.js'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'

const MAX_ITEMS = 10

@Component({
  components: {
    AppTimeAgo,
    AppPaginate
  }
})
export default class HolderTableTransfers extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Array) transfers!: Array<any>
  @Prop(String) totalTransfers!: string
  @Prop(Number) page!: number
  @Prop(String) decimals?: string
  @Prop(Boolean) loading?: boolean
  @Prop(Boolean) hasError?: boolean

  /*
 ===================================================================================
   Methods
 ===================================================================================
 */

  formatTimestamp(timestamp: string) {
    const bn = new BN(timestamp)
    return new Date(bn.times(1000).toNumber())
  }

  calculateTransferValue(value: string) {
    const n = new BN(value)
    if (this.decimals) {
      return n
        .div(new BN(10).pow(this.decimals))
        .toFixed()
        .toString()
    }
    return n.toFormat().toString()
  }

  setPage(page: number): void {
    this.$emit('page', page)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Given a MAX_ITEMS per page, calculate the number of pages for pagination.
   * @return {Integer} - Number of pages of results
   */
  get numPages() {
    return this.totalTransfers.length > 0 ? Math.ceil(new BN(this.totalTransfers).toNumber() / MAX_ITEMS) : 0
  }
}
</script>
