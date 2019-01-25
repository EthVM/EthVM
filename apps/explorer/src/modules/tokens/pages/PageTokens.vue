<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <table-tokens :tokens="tokens" />
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
  tokens = []

  /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

  async mounted() {
    try {
      this.tokens = await this.fetchTokens()
    } catch (e) {
      // handle error accordingly
    }
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * GET and return a JSON array of ETH-based tokens
   *
   * @return {Array} - Array of ETH Tokens.
   */
  fetchTokens() {
    return new Promise((resolve, reject) => {
      this.$http
        .get('http://api.ethplorer.io/getTop?apiKey=freekey&criteria=cap')
        .then(response => {
          resolve(response.data.tokens)
        })
        .catch(err => {
          reject(err)
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
}
</script>
