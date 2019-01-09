<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-blocks :blocks="uncles" page-type="uncles" :loading="uncleLoad"></table-blocks> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Visibility from 'visibilityjs'
import { Events } from 'ethvm-common'
import BN from 'bignumber.js'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import TableBlocks from '@app/components/tables/TableBlocks.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks
  }
})
export default class PageUncles extends Vue {
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.uncles'),
          disabled: true
        }
      ]
    }
  }

  // Computed
  get uncles() {
    return this.$store.getters.getUncles.slice(0, MAX_ITEMS)
  }
  get uncleLoad(): boolean {
    return this.uncles.length > 0 ? false : true
  }
}
</script>
