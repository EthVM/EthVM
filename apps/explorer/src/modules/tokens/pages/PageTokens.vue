<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <token-table :tokens="tokens" :total-tokens="total" :loading="isLoading" :error="error" :page="page" @getTokens="getTokens" />
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokenTable from '@app/modules/tokens/components/TokenTable.vue'
import { Component, Vue } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TokenTable
  }
})
export default class PageTokens extends Vue {
  tokens: any = []
  total = 0
  isLoading = true
  page = 0
  error = ''
  filterValues = ['price_high', 'price_low', 'volume_high', 'volume_low', 'market_cap_high', 'market_cap_low']

  /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

  mounted() {
    this.fetchTotalTokens().then(res => (this.total = res), err => (this.total = 0))
    this.getTokens(0, 0)
    window.scrollTo(0, 0)
  }

  /*
  ===================================================================================
    Methods - Load Data
  ===================================================================================
  */

  /**
   * GET and return JSON array of tokens and their corresponding information
   *
   * @return {Array} - Array of tokens
   */
  fetchTokenExchangeRates(page: number, filter: string) {
    return this.$api.getTokenExchangeRates(filter, MAX_ITEMS, page)
  }

  fetchTotalTokens(): Promise<number> {
    return this.$api.getTotalNumberOfTokenExchangeRates()
  }

  getTokens(page: number, filter: number): void {
    this.isLoading = true
    this.page = page
    this.fetchTokenExchangeRates(page, this.filterValues[filter]).then(
      res => {
        this.tokens = res
        this.isLoading = false
      },
      err => {
        this.error = this.$i18n.t('message.error').toString()
      }
    )
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Returns breadcrumbs entry for this particular view.
   * Required for AppBreadCrumbs
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.tokens'),
        disabled: true
      }
    ]
  }

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasError() {
    return this.error !== ''
  }
}
</script>
