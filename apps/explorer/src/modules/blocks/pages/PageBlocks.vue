<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-info-card-group />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-blocks :loading="blocksLoad" :blocks="blocks" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppInfoCardGroup from '@app/core/components/ui/AppInfoCardGroup.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import { Block } from '@app/core/models'
import { Vue, Component, Mixins } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks,
    AppInfoCardGroup
  }
})
export default class PageBlocks extends Vue {
  // Computed
  get blocks(): Block[] {
    return this.$store.getters.blocks.slice(0, MAX_ITEMS)
  }

  get blocksLoad(): boolean {
    return this.blocks.length === 0
  }

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
