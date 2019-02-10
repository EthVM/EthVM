<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks :loading="loading" :blocks="blocks" />
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

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks,
    AppCardStatsGroup
  }
})
export default class PageBlocks extends Vue {
  blocks: Block[] = []
  page = 0
  loading = true
  error = false

  // Lifecycle
  mounted() {
    this.fetchBlocks(this.page).then(res => {
      this.blocks = this.blocks.concat(res)
      this.loading = false
    })
  }

  // Methods
  fetchBlocks(page: number, limit = MAX_ITEMS): Promise<Block[]> {
    return this.$api.getBlocks(MAX_ITEMS, page)
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
