<template>
  <div>

    <!-- Pagination -->
    <v-layout row fill-height align-center justify-space-between>
      <div v-html="paginationText" class="ml-2"></div>
      <v-pagination
        v-model="page"
        :length="numPages"
        class="mt-2 mb-2">
      </v-pagination>
    </v-layout>
    <!-- End Pagination -->

    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm8 md5>
          <h5>{{ $t('tableHeader.txN') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.age') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.quantity') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->

    <!-- Start Rows -->
    <v-card color="white" v-for="tx in transfersPage" class="transparent" flat :key="tx.getHash()">
      <v-layout align-center justify-start row fill-height pr-3>
        <!-- Column 1 -->
        <v-flex xs6 sm8 md5>
          <v-flex d-flex xs12 pb-2>
            <router-link class="primary--text text-truncate font-italic psmall" :to="'/tx/' + tx.getHash()">{{ tx.getHash() }}</router-link>
          </v-flex>
          <v-flex xs12 pt-0>
            <v-layout row pl-2>
              <p class="text-truncate info--text mb-0">
                {{ $t('tx.from') }}:
                <router-link :to="'/address/' + tx.getFrom().toString()" class="secondary--text font-italic font-weight-regular">
                  {{ tx.getFrom().toString() }}
                </router-link>
              </p>
              <v-icon class="fas fa-arrow-right primary--text pl-1 pr-2 pb-1" small></v-icon>
              <p class="text-truncate info--text font-weight-thin mb-0" v-if="!tx.getContractAddress().isEmpty()">
                {{ $t('tx.contract') }}:
                <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getContractAddress().toString()">
                  {{ tx.getContractAddress().toString() }}
                </router-link>
              </p>
              <p class="text-truncate info--text font-weight-thin mb-0" v-else>
                <strong>{{ $t('tx.to') }}:</strong>
                <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getTo().toString()">
                  {{ tx.getTo().toString() }}
                </router-link>
              </p>
            </v-layout>
          </v-flex>
        </v-flex>
        <!-- End Column 1 -->

        <!-- Column 2 -->
        <v-flex hidden-sm-and-down md2>
          <p>{{ tx.getTimestamp() }}</p>
        </v-flex>
        <!-- End Column 2 -->

        <!-- Column 3 -->
        <v-flex hidden-sm-and-down md2>
          <p>{{ tx.getValue().toEth() }}</p>
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
import { Tx } from '@app/core/models'

const MAX_ITEMS = 10

@Component
export default class TransferTableTokens extends Vue {
  @Prop(Array) transfers: Tx[]

  page = 1 // Current pagination page number

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
    return Math.ceil(this.transfers.length / MAX_ITEMS)
  }

  /**
   *  Calculate which portion of the transfers array results to display
   *  based on the current pagination page.
   *  @return {Tx[]} - Array of transfers
   */
  get transfersPage(): Tx[] {
    const startIndex = (this.page - 1) * MAX_ITEMS
    const endIndex = startIndex + MAX_ITEMS
    return this.transfers.slice(startIndex, endIndex)
  }

  /**
   * Correctly generate/format text for pagination display.
   * @return {String} - Pagination text
   */
  get paginationText() {
    const start = ((this.page - 1) * MAX_ITEMS) + 1
    const end = start + this.transfersPage.length - 1
    return `Showing results ${start} - ${end} of ${this.transfers.length}`
  }
}
</script>
