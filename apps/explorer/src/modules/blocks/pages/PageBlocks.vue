<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks :loading="loading" :blocks="blocks" :totalBlocks="total" :maxItems="MAX_ITEMS" @getBlockPage="getPage"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import { Block } from '@app/core/models'
import { Vue, Component, Mixins } from 'vue-property-decorator'



@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks,
    AppCardStatsGroup
  }
})
export default class PageBlocks extends Vue {
  blocks: Block[] = []
  loading = true
  error = false
  total = 0
  MAX_ITEMS = 50

  // Lifecycle
  mounted() {
    this.fetchTotalBlocks().then(res => {
      this.total = res
    })
    this.getPage(0)
  }

  // Methods
  fetchBlocks(page: number): Promise<Block[]> {
    return this.$api.getBlocks(this.MAX_ITEMS, page)
  }

  fetchTotalBlocks(): Promise<Number> {
     return this.$api.getTotalNumberOfBlocks()
  }

  getPage(_page: number):void {
    this.loading = true
    this.fetchBlocks(_page).then(res => {
      this.loading = false
      this.blocks = res
      console.log(this.blocks.length)
    })
  }
  // Computed
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.blocks'),
        disabled: true
      }
    ]
  }
}
</script>
