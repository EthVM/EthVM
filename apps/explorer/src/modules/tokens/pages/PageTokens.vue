<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <table-tokens :tokens="tokens" :is-loading="isLoading" />
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TableTokens from '@app/modules/tokens/components/TableTokens.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    AppBreadCrumbs,
    TableTokens
  }
})
export default class PageTokens extends Vue {
  tokens: any = [] // Array of tokens for table display
  hasError = false // Boolean flag to determine whether or not there is an error to display
  error = '' // Error message

  /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

  mounted() {
    this.fetchData()
  }

  /*
  ===================================================================================
    Methods - Load Data
  ===================================================================================
  */

  /**
   * Fetch all data relevant to the view.
   */
  fetchData() {
    const tokenPromise = this.fetchTokenExchangeRates()
    const promises = [tokenPromise]

    Promise.all(promises)
      .then(([tokens]) => {
        this.tokens = tokens as any[]
      })
      .catch(e => {
        this.hasError = true
        this.error = e
      })
  }

  /*
  ===================================================================================
    Methods - Fetch Data - Individual Calls
  ===================================================================================
  */

  /**
   * GET and return JSON array of tokens and their corresponding information
   *
   * @return {Array} - Array of tokens
   */
  fetchTokenExchangeRates() {
    return new Promise((resolve, reject) => {
      this.$api
        .getTokenExchangeRates(99999, 0)
        .then(result => {
          resolve(result)
        })
        .catch(e => {
          reject(e)
        })
    })
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
   * Determines whether or not all of the required objects have been loaded/populated
   *
   * @return {Boolean}
   */
  get isLoading() {
    return this.tokens.length === 0
  }
}
</script>
