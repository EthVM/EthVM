<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks :loading="isLoading" :blocks="blocks" :total-blocks="total" :max-items="max" :error="error" @getBlockPage="getPage" />
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
  isLoading = true
  error = ''
  total = 0

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.fetchTotalBlocks().then(
      res => {
        this.total = res
      },
      err => {
        this.total = 0
      }
    )
    this.getPage(0)
    window.scrollTo(0, 0)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  fetchBlocks(page: number): Promise<Block[]> {
    return this.$api.getBlocks(this.max, page)
  }

  fetchTotalBlocks(): Promise<number> {
    return this.$api.getTotalNumberOfBlocks()
  }

  getPage(page: number): void {
    this.isLoading = true
    this.fetchBlocks(page).then(
      res => {
        this.isLoading = false
        this.blocks = res
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

  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.blocks'),
        disabled: true
      }
    ]
  }

  get max(): number {
    return MAX_ITEMS
  }
}
</script>
