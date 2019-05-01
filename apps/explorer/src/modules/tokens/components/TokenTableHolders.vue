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
          <h5>{{ $tc('address.name', 1) }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('common.quantity') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('common.percentage') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->

    <!-- Start Rows -->
    <v-card color="white" v-for="holder in holders" class="transparent" flat :key="holder.address">
      <v-layout align-center justify-start row fill-height pr-3>
        <!-- Column 1 -->
        <v-flex xs6 sm8 md5>
          <router-link class="primary--text text-truncate font-italic psmall pb-0 ml-2" :to="holderAddress(holder)">
            {{ holder.address }}
          </router-link>
        </v-flex>
        <!-- End Column 1 -->

        <!-- Column 2 -->
        <v-flex hidden-sm-and-down md2>
          <p class="mb-0 ml-2">{{ holderBalance(holder) }}</p>
        </v-flex>
        <!-- End Column 2 -->

        <!-- Column 3 -->
        <v-flex hidden-sm-and-down md2>
          <p class="mb-0 ml-2">{{ holderShare(holder) }}</p>
        </v-flex>
        <!-- End Column 3 -->
      </v-layout>
      <v-divider class="mb-2" />
    </v-card>
    <!-- End Rows -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'

const MAX_ITEMS = 10

@Component({
  components: {
    AppPaginate
  }
})
export default class TokenTableHolders extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Array) holders!: Array<any>
  @Prop(Number) totalHolders!: number
  @Prop(Number) page!: number
  @Prop(String) addressRef!: string
  @Prop(String) totalSupply?: string
  @Prop(String) decimals?: string
  @Prop(Boolean) loading?: boolean

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Format url to token details -> holder view
   *
   * @param  {Object} holder - Holder object
   * @return {String}        [description]
   */
  holderAddress(holder) {
    return `/token/${this.addressRef}?holder=${holder.address}`
  }

  /**
   * Calculate percentage share of totalSupply held by this holder
   * @param  {Object} holder - Holder object
   * @return {String} - Share
   */
  holderShare(holder) {
    if (!(this.totalSupply && holder.balance)) {
      return 'N/A'
    }
    const balance = new BN(holder.balance)
    const totalSupply = new BN(this.totalSupply)
    return `${balance.div(totalSupply).times(100)}%`
  }

  /**
   * Calculate balance held by given holder
   * @param  {Object} holder - Holder object
   * @return {String} - Amount
   */
  holderBalance(holder) {
    if (this.decimals) {
      const n = new BN(holder.balance)
      return n
        .div(new BN(10).pow(this.decimals))
        .toFixed()
        .toString()
    }
    return holder.balance
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
    return this.totalHolders > 0 ? Math.ceil(this.totalHolders / MAX_ITEMS) : 0
  }
}
</script>
