<template>
  <v-card color="white" flat v-if="contracts" class="pt-3 pr-2 pl-2 pb-0">
    <!--
    =====================================================================================
      !hasError
    =====================================================================================
    -->
    <div v-if="!hasError">
      <v-layout justify-space-between row wrap class="pr-2 pl-2">
        <v-flex v-if="loading" xs12>
          <v-progress-linear color="blue" indeterminate />
        </v-flex>
        <v-flex xs12 sm6>
          <!--          <p class="info&#45;&#45;text mb-0 pl-2">-->
          <!--            {{ $t('contract.total') }}:-->
          <!--            <span v-if="!loading" class="black&#45;&#45;text">{{ totalCount.toString() }}</span>-->
          <!--            <span v-else class="table-row-loading" />-->
          <!--            {{ contractString }}-->
          <!--          </p>-->
        </v-flex>
        <v-layout justify-end v-if="!loading && showPaginate" xs12 sm6>
          <v-flex shrink>
            <app-paginate-has-more :has-more="contractsPage.hasMore" :current-page="page" @newPage="setPage" />
          </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          TABLE HEADER
        =====================================================================================
        -->
        <v-flex xs12 hidden-xs-only>
          <v-card color="info" flat class="white--text pl-3 pr-1 mb-1" height="40px">
            <v-layout align-center justify-start row fill-height pr-3>
              <v-flex sm4>
                <h5>{{ $t('contract.hash') }}</h5>
              </v-flex>
              <v-flex sm4>
                <h5>{{ $t('contract.created') }}</h5>
              </v-flex>
              <v-flex sm2>
                <h5>{{ $t('common.age') }}</h5>
              </v-flex>
              <v-flex sm2>
                <h5>{{ $t('tx.cost') }}</h5>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <!--
      =====================================================================================
        TABLE BODY
      =====================================================================================
      -->
      <div v-if="loading">
        <v-flex sm12 hidden-xs-only>
          <div v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
              <v-flex sm4>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex sm4>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex sm2>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex sm2>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
          </div>
        </v-flex>
        <v-flex xs12 hidden-sm-and-up>
          <div class="table-row-mobile ma-1" v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pa-2 ">
              <v-flex xs4>
                <div class="table-row-loading"></div>
              </v-flex>
              <v-flex xs12>
                <div class="table-row-loading"></div>
              </v-flex>
              <v-flex xs12>
                <div class="table-row-loading"></div>
              </v-flex>
              <v-flex xs4>
                <div class="table-row-loading"></div>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </div>
      <div v-else>
        <v-card v-if="contracts.length === 0" flat>
          <!--
          =====================================================================================
            Note: Once modularized, This case will not exhists,
                  since module won't load if address did not create any contract
          =====================================================================================
           -->
          <v-card-text class="text-xs-center secondary--text">No Contracts</v-card-text>
        </v-card>
        <div v-if="contracts.length > 0">
          <table-address-contracts-row v-for="(contract, index) in contracts" :key="index" :contract="contract" />
        </div>
        <v-layout v-if="showPaginate" justify-end row class="pb-1 pr-2 pl-2">
          <app-paginate-has-more :has-more="contractsPage.hasMore" :current-page="page" @newPage="setPage" />
        </v-layout>
      </div>
    </div>
    <!--
    =====================================================================================
      hasError
    =====================================================================================
    -->
    <app-error v-else :has-error="hasError" :message="error" />
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import TableAddressContractsRow from '@app/modules/addresses/components/TableAddressContractsRow.vue'
import { contractsCreatedBy } from '@app/modules/addresses/addresses.graphql'
import { ContractSummaryPageExt } from '@app/core/api/apollo/extensions/contract-summary-page.ext'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'

const MAX_ITEMS = 10

@Component({
  components: {
    AppPaginateHasMore,
    AppError,
    AppInfoLoad,
    TableAddressContractsRow
  },
  data() {
    return {
      page: 0,
      error: undefined
    }
  },
  apollo: {
    contractsPage: {
      query: contractsCreatedBy,

      variables() {
        const { address, maxItems: limit } = this

        return {
          address,
          limit
        }
      },

      update({ summaries }) {
        if (summaries) {
          this.error = '' // clear the error
          return new ContractSummaryPageExt(summaries)
        }
        this.error = this.error || this.$i18n.t('message.err')
        return summaries
      },

      error({ graphQLErrors, networkError }) {
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      }
    }
  }
})
export default class TableAddressContracts extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String!) address!: string

  contractsPage?: ContractSummaryPageExt
  error?: string
  page?: number

    /*
===================================================================================
Lifecycle
===================================================================================
*/

    mounted() {
        this.$apollo.queries.contractsPage.refetch()
    }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Upon page update from AppPagination, set page equal to pagination page.
   */
  setPage(page: number): void {
    const { contractsPage: query } = this.$apollo.queries

    const self = this

    query.fetchMore({
      variables: {
        address: self.address,
        offset: page * this.maxItems,
        limit: this.maxItems
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        self.page = page
        return fetchMoreResult
      }
    })
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get contracts() {
    return this.contractsPage ? this.contractsPage.items || [] : []
  }

  get loading() {
    return this.$apollo.loading
  }

  get hasError(): boolean {
    return !!this.error && this.error !== ''
  }

  // get totalCount(): BigNumber {
  //   return this.contractsPage ? this.contractsPage.totalCountBN : new BigNumber(0)
  // }

  get contractString(): string {
    return this.contractsPage && this.contractsPage.items.length > 1 ? this.$i18n.tc('contract.name', 2) : this.$i18n.tc('contract.name', 1)
  }

  /**
   * @return {Number} - MAX_ITEMS per pagination page
   */
  get maxItems(): number {
    return MAX_ITEMS
  }

  /**
   * @return {Number} - Total number of pagination pages
   */
  // get pages(): number {
  //   return this.contractsPage ? Math.ceil(this.contractsPage!.totalCountBN.div(this.maxItems).toNumber()) : 0
  // }

  get showPaginate(): boolean {
    if (this.page && this.page > 0) {
      // If we're past the first page, there must be pagination
      return true
    } else if (this.contractsPage && this.contractsPage.hasMore) {
      // We're on the first page, but there are more items, show pagination
      return true
    }
    return false
  }
}
</script>

<style scoped lang="css">

.table-row-mobile {
  border: 1px solid #b4bfd2;
}
</style>
