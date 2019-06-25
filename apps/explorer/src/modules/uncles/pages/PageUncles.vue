<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-uncles :max-items="max" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
//import TableUncles from '@app/modules/uncles/components/TableUncles.vue'
import TableUncles from '@app/modules/uncles/components/UnclesTableLayout/UnclesTableLayout.vue'
import { Crumb } from '@app/core/components/props'
import { Component, Vue } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableUncles
  }
})
export default class PageUncles extends Vue {
  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get crumbs(): Crumb[] {
    return [
      {
        text: 'uncle.name',
        disabled: true,
        plural: 2
      }
    ]
  }

  get max(): number {
    return MAX_ITEMS
  }
}
</script>
