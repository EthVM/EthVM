<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-uncles :uncles="uncles" page-type="uncles" :loading="loading" :totalUncles="total" @getUnclePage="getPage" :maxItems="max"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events } from 'ethvm-common'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TableUncles from '@app/modules/uncles/components/TableUncles.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Uncle } from '@app/core/models'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableUncles
  }
})
export default class PageUncles extends Vue {
  uncles: Uncle[] = []
  total = 0
  loading = true
  error = false

  // Lifecycle
  mounted() {
    this.fetchTotalUncles().then(res => {
      this.total = res
    },
    err => {
      this.total = 0
    })
    this.getPage(0)
  }


  // Methods
  getPage(_page): void {
    this.loading = true
    this.fetchUncles(_page).then(res => {
      this.uncles = (res)
      this.loading = false
    },
    err => {
      this.error=true
    })
  }
  fetchUncles(page: number): Promise<Uncle[]> {
    return this.$api.getUncles(this.max, page)
  }

  fetchTotalUncles(): Promise<number> {
     return this.$api.getTotalNumberOfUncles()
  }

  // Computed
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.uncles'),
        disabled: true
      }
    ]
  }
  get max(): number {
    return MAX_ITEMS
  }
}
</script>
