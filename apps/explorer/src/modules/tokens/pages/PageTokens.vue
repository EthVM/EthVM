<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-card v-if="isRopsten" flat :class="{ 'pa-1': $vuetify.breakpoint.xsOnly, 'pa-3': $vuetify.breakpoint.smOnly, 'pa-5': $vuetify.breakpoint.mdAndUp }">
      <v-layout align-center justify-center column class="mb-4">
        <v-flex xs12>
          <v-img :src="require('@/assets/no-data.png')" min-width="250px" min-height="10px" contain></v-img>
        </v-flex>
        <v-layout row>
          <v-spacer />
          <v-flex xs12 sm9 md7>
            <v-card-text class="font-weight-thin font-italic text-xs-center">{{ $t('message.ropsten-no-token') }}</v-card-text>
          </v-flex>
          <v-spacer />
        </v-layout>
      </v-layout>
    </v-card>
    <token-table v-else :max-items="maxItems" />
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokenTable from '@app/modules/tokens/components/TokenTable.vue'
import { Crumb } from '@app/core/components/props'
import { TokenExchange } from '@app/modules/tokens/props'
import { ConfigHelper } from '@app/core/helper/config-helper'
import { Component, Vue } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TokenTable
  }
})
export default class PageTokens extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  isRopsten = ConfigHelper.isRopsten

  /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

  mounted() {
    window.scrollTo(0, 0)
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
  get crumbs(): Crumb[] {
    return [
      {
        text: this.$tc('token.name', 2)
      }
    ]
  }

  get maxItems(): number {
    return MAX_ITEMS
  }
}
</script>
