<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-blocks :max-blocks="true" :blocks="getuncles" :frame-blocks="false"></table-blocks> </v-flex>
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
      uncles: [],
      items: [
        {
          text: this.$i18n.t('title.uncles'),
          disabled: true
        }
      ],
      maxItems: MAX_ITEMS
    }
  }

  created() {
    this.uncles = this.$store.getters.getUncles
    this.$eventHub.$on(Events.newUncle, _uncle => {
      if (Visibility.state() === 'visible') {
        this.uncles = this.$store.getters.getUncles
      }
    })
  }

  beforeDestroy() {
    this.$eventHub.$off(Events.newUncle)
  }

  // Computed
  get getuncles() {
    return this.uncles.slice(0, this.maxItems)
  }
}
</script>
