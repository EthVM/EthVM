<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks
          :loading="isLoading"
          :blocks="blocks"
          :total-blocks="total"
          :max-items="max"
          :error="error"
          :page="page"
          @getBlockPage="getPage"
          @updateTable="initialLoad"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import { Block, SimpleBlock } from '@app/core/models'
import { Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks,
    AppCardStatsGroup
  }
})
export default class PageBlocks extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  blocks: SimpleBlock[] = []
  from: number = -1
  isLoading = true
  firstLoad = true
  error = ''
  total = 0
  page = 0

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.initialLoad()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  initialLoad(): void {
    this.fetchTotalBlocks().then(res => (this.total = res), err => (this.total = 0))
    this.getPage(0)
    window.scrollTo(0, 0)
  }

  fetchBlocks(page: number): Promise<Block[] | SimpleBlock[]> {
    return this.$api.getBlocks('simple', this.max, page, this.from)
  }

  fetchTotalBlocks(): Promise<number> {
    return this.$api.getTotalNumberOfBlocks()
  }

  getPage(page: number): void {
    // Don't want to fetch same page twice from pagination event //
    if (!this.firstLoad && this.isLoading) {
      return
    }
    this.page = page
    this.isLoading = true
    this.fetchBlocks(page).then(
      (res: SimpleBlock[]) => {
        this.blocks = res
        if (this.firstLoad) {
          this.from = this.blocks.length > 0 ? this.blocks[0].getNumber() : -1
          this.firstLoad = false
        }
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

  get crumbs(): Crumb[] {
    return [
      {
        text: this.$tc('block.name', 2).toString(),
        disabled: true
      }
    ]
  }

  get max(): number {
    return MAX_ITEMS
  }
}
</script>
