<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" /> hello
    <token-table :tokens="tokens"  :loading="isLoading"/>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokenTable from '@app/modules/tokens/components/TokenTable.vue'
import { Component, Vue } from 'vue-property-decorator'

const MAX_ITEMS = 10

@Component({
  components: {
    AppBreadCrumbs,

    TokenTable
  }
})
export default class PageTokens extends Vue {
  tokens: any = [] // Array of tokens for table display
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
        console.log(this.tokens)
      })
      .catch(e => {
        this.error = this.$i18n.t('message.error').toString()
      })
  }

  /*
  ===================================================================================
    Methods - Fetch Data - Individual Calls
  ===================================================================================
  */

  /**
   * GET and return JSON array of tokens and their corresponding information
   * TEMP: Static/hard-coded page/limit
   *
   * @return {Array} - Array of tokens
   */
  fetchTokenExchangeRates() {
    return new Promise((resolve, reject) => {
      this.$api
        .getTokenExchangeRates(100, 0)
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
