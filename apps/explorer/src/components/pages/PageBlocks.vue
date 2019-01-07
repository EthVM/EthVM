<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" color-type="primary white--text" back-type="last-block" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.time')" :value="secSinceLastBlock" color-type="success white--text" back-type="time-since" metrics="sec" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.hashR')" :value="latestHashRate" color-type="warning white--text" back-type="hash-rate" metrics="Th/s" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.diff')" :value="latestDifficulty" color-type="error white--text" back-type="difficulty" metrics="Th" />
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-blocks v-if="blocks" :blocks="blocks"></table-blocks> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Visibility from 'visibilityjs'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import AppInfoCard from '@app/components/ui/AppInfoCard.vue'
import TableBlocks from '@app/components/tables/TableBlocks.vue'
import { LastBlockInfoMixin } from '@app/components/mixins'
import { Events } from 'ethvm-common'
import { Block } from '@app/models'
import { Vue, Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks,
    AppInfoCard
  }
})
export default class PageBlocks extends mixins(LastBlockInfoMixin) {
  data() {
    return {
      blocks: [],
      items: [
        {
          text: this.$i18n.t('title.blocks'),
          disabled: true
        }
      ]
    }
  }

  created() {
    this.blocks = this.$store.getters.getBlocks
    this.$eventHub.$on(Events.newBlock, _block => {
      if (Visibility.state() === 'visible') {
        this.blocks = this.getBlocks
      }
    })
  }

  beforeDestroy() {
    this.$eventHub.$off(Events.newBlock)
  }

  get getBlocks() {
    return this.blocks.slice(0, MAX_ITEMS)
  }
}
</script>
