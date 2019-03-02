<template>
  <div>
    <!-- Pagination -->
    <v-layout row fill-height align-center justify-space-between>
      <div v-html="paginationText" class="ml-2"></div>
      <v-pagination v-model="page" :length="numPages" class="mt-2 mb-2"> </v-pagination>
    </v-layout>
    <!-- End Pagination -->

    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm8 md5>
          <h5>{{ $t('title.address') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.quantity') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.percentage') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->

    <!-- Start Rows -->
    <v-card color="white" v-for="holder in holdersPage" class="transparent" flat :key="holder.address">
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
          <p class="mb-0 ml-2">{{ holder.balance }}</p>
        </v-flex>
        <!-- End Column 2 -->

        <!-- Column 3 -->
        <v-flex hidden-sm-and-down md2>
          <p class="mb-0 ml-2">{{ holder.share }}%</p>
        </v-flex>
        <!-- End Column 3 -->
      </v-layout>
      <v-divider class="mb-2" />
    </v-card>
    <!-- End Rows -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

const MAX_ITEMS = 5

@Component
export default class TokenTableHolders extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Array) holders: Array<any>
  @Prop(String) addressRef: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  page = 1 // Current pagination page number

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
    return Math.ceil(this.holders.length / MAX_ITEMS)
  }

  /**
   *  Calculate which portion of the holders array results to display
   *  based on the current pagination page.
   *  @return {Array} - Array of holders
   */
  get holdersPage() {
    const startIndex = (this.page - 1) * MAX_ITEMS
    const endIndex = startIndex + MAX_ITEMS
    return this.holders.slice(startIndex, endIndex)
  }

  /**
   * Correctly generate/format text for pagination display.
   * @return {String} - Pagination text
   */
  get paginationText() {
    const start = this.holders.length > 0 ? (this.page - 1) * MAX_ITEMS + 1 : 0
    const end = this.holders.length > 0 ? start + this.holdersPage.length - 1 : 0
    return `Showing results ${start} - ${end} of ${this.holders.length}`
  }
}
</script>
