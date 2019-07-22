<template>
  <v-card color="white" flat class="pt-3 pb-2 mt-0">
    <!--
        =====================================================================================
          TITLE
        =====================================================================================
    -->
    <app-table-title page-type="tokens" :title=" $tc('token.name', 2) " :title-caption="`(Total: ${totalCount } ${$tc('token.name', 2) })`">
      <template v-slot:pagination v-if="pages > 1 && !hasError">
        <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
      </template>
    </app-table-title>
    <!--
        =====================================================================================
          LOADING / ERROR
        =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <!-- <app-error v-if="hasError" :has-error="hasError" :message="error" class="mb-4" /> -->
    <!--
        =====================================================================================
          TABLE HEADER
        =====================================================================================
    -->
    <v-layout>
      <v-flex hidden-xs-only sm12>
        <v-card v-if="!hasError" color="info" flat class="white--text pl-4 pr-1" height="40px">
          <v-layout align-center justify-start row fill-height pr-3>
            <v-flex hidden-xs-only sm4 pl-2>
              <h5 class="pl-5">{{ $tc('token.name', 1) }}</h5>
            </v-flex>
            <v-flex hidden-xs-only sm2>
              <v-layout align-center justify-start row pl-1>
                <h5 class="pr-2">{{ $tc('price.name', 1) }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectFilter(0)">
                      <v-icon
                        :class="[isActive(0) ? 'white--text' : 'bttnToken--text']"
                        small
                      >fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectFilter(1)">
                      <v-icon
                        :class="[isActive(1) ? 'white--text' : 'bttnToken--text']"
                        small
                      >fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex hidden-xs-only sm2 pl-0>
              <h5>{{ $t('token.change') }}</h5>
            </v-flex>
            <v-flex hidden-xs-only sm2>
              <v-layout align-center justify-start row pl-2>
                <h5 class="pr-1">{{ $t('token.volume') }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectFilter(2)">
                      <v-icon
                        :class="[isActive(2) ? 'white--text' : 'bttnToken--text']"
                        small
                      >fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectFilter(3)">
                      <v-icon
                        :class="[isActive(3) ? 'white--text' : 'bttnToken--text']"
                        small
                      >fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex hidden-xs-only sm2>
              <v-layout align-center justify-start row pl-2>
                <h5 class="pr-1">{{ $t('token.market') }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectFilter(4)">
                      <v-icon
                        :class="[isActive(4) ? 'white--text' : 'bttnToken--text']"
                        small
                      >fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectFilter(5)">
                      <v-icon
                        :class="[isActive(5) ? 'white--text' : 'bttnToken--text']"
                        small
                      >fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex hidden-sm-and-up xs12 mr-1 ml-1>
        <token-filter @filterMobile="selectFilter" />
      </v-flex>
    </v-layout>
    <!--
        =====================================================================================
          TABLE BODY
        =====================================================================================
    -->

    <v-card flat v-if="!hasError">
      <v-layout column fill-height class="mb-1">
        <v-flex xs12 v-if="!loading">
          <v-card-text
            v-if="!tokens.length"
            class="text-xs-center secondary--text"
          >{{ $t('message.token.no-tokens') }}</v-card-text>
          <div v-else v-for="token in tokens" class="transparent" flat :key="token._id">
            <token-table-row :token="token" />
          </div>
          <v-layout v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2">
            <app-paginate :total="pages" @newPage="setPage" :current-page="page" />
          </v-layout>
        </v-flex>
        <v-flex xs12 v-else>
          <div v-for="i in maxItems" :key="i">
            <token-table-row-loading />
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import TokenFilter from '@app/modules/tokens/components/TokenFilter.vue'
import TokenTableRow from '@app/modules/tokens/components/TokenTableRow.vue'
import TokenTableRowLoading from '@app/modules/tokens/components/TokenTableRowLoading.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { tokenExchangeRates } from '@app/modules/tokens/tokens.graphql'
import { TokenExchangeRatePageExt } from '@app/core/api/apollo/extensions/token-exchange-rate-page.ext'

@Component({
  components: {
    AppError,
    AppPaginate,
    AppTableTitle,
    TokenFilter,
    TokenTableRow,
    TokenTableRowLoading
  },
  data() {
    return {
      page: 0,
      error: undefined,
      sort: 'price_high',
      syncing: undefined
    }
  },
  apollo: {
    tokenExchangeRatePage: {
      query: tokenExchangeRates,
      variables() {
        return {
          offset: 0,
          limit: this.maxItems,
          sort: this.filterValues[this.selectedFilter]
        }
      },
      update({ tokenExchangeRates }) {
        if (tokenExchangeRates) {
          this.error = '' // clear error
          return new TokenExchangeRatePageExt(tokenExchangeRates)
        } else if (!this.syncing) {
          this.error = this.error || this.$i18n.t('message.err')
        }
        return tokenExchangeRates
      },

      error({ graphQLErrors, networkError }) {
        const self = this

        if (graphQLErrors) {
          graphQLErrors.forEach(error => {
            switch (error.message) {
              case 'Currently syncing':
                // TODO handle this better with custom code or something
                self.syncing = true
                break
              default:
              // Do nothing
            }
          })
        }
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      }
    }
  }
})
export default class TokenTable extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */
  @Prop(Number!) maxItems!: number

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  selectedFilter = 0
  page!: number
  error: string = ''
  filterValues = ['price_high', 'price_low', 'volume_high', 'volume_low', 'market_cap_high', 'market_cap_low']
  syncing?: boolean

  tokenExchangeRatePage?: TokenExchangeRatePageExt

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  selectFilter(_value: number): void {
    this.selectedFilter = _value
    this.page = 0
  }

  /**
   * Upon page update from AppPagination, set page equal to pagination page.
   */
  setPage(page: number): void {
    const { tokenExchangeRatePage: query } = this.$apollo.queries

    const self = this
    const sort = self.filterValues[self.selectedFilter]

    query.fetchMore({
      variables: {
        sort,
        offset: page * this.maxItems,
        limit: this.maxItems
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        self.page = page
        return fetchMoreResult
      }
    })
  }

  isActive(_value: number): boolean {
    return this.selectedFilter === _value
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get tokens() {
    return this.tokenExchangeRatePage ? this.tokenExchangeRatePage.items || [] : []
  }

  get loading() {
    return this.$apollo.loading || this.syncing
  }

  get hasError(): boolean {
    return !!this.error && this.error !== ''
  }

  get totalCount(): number {
    return this.tokenExchangeRatePage ? this.tokenExchangeRatePage.totalCount : 0
  }

  get pages(): number {
    return this.tokenExchangeRatePage ? Math.ceil(this.tokenExchangeRatePage!.totalCount / this.maxItems) : 0
  }
}
</script>

<style scoped lang="css">
.v-btn.v-btn--flat.v-btn--icon {
  height: 12px;
  width: 12px;
  margin: 0;
}
</style>
