<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <token-table :tokens="tokens" :total-tokens="total" :loading="isLoading" />
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokenTable from '@app/modules/tokens/components/TokenTable.vue'
import { Component, Vue } from 'vue-property-decorator'

const MAX_ITEMS = 100

@Component({
  components: {
    AppBreadCrumbs,
    TokenTable
  }
})
export default class PageTokens extends Vue {
  tokens: any = [] // Array of tokens for table display
  total = 0 // Total number of tokens
  isLoading = true
  error = ''

  /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

  mounted() {
    this.fetchTotalTokens().then(res => (this.total = res), err => (this.total = 0))
    this.getPage(0)
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
  fetchTokenExchangeRates(page: number) {
    return this.$api.getTokenExchangeRates(MAX_ITEMS, page)
  }

  fetchTotalTokens(): Promise<number> {
    return this.$api.getTotalNumberOfTokenExchangeRates()
  }

  getPage(page: number): void {
    this.isLoading = true
    this.fetchTokenExchangeRates(page).then(
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
