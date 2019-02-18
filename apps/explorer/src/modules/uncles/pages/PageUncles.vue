<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-uncles :uncles="uncles" page-type="uncles" :loading="isLoading" :total-uncles="total" @getUnclePage="getPage" :max-items="max" :error="error" />
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
  from: number = -1
  firstLoad: boolean = true
  isLoading = true
  total = 0
  error = ''

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.fetchTotalUncles().then(
      res => {
        this.total = res
      },
      err => {
        this.total = 0
      }
    )
    this.getPage(0)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getPage(page): void {
    this.isLoading = true
    this.fetchUncles(page).then(
      res => {
        this.uncles = res
        if (this.firstLoad) {
          this.from = this.uncles.length > 0 ? this.uncles[0].getBlockHeight() : -1
          this.firstLoad = false
        }
        this.isLoading = false
      },
      err => {
        this.error = 'error'
      }
    )
  }

  fetchUncles(page: number): Promise<Uncle[]> {
    return this.$api.getUncles(this.max, page, this.from)
  }

  fetchTotalUncles(): Promise<number> {
    return this.$api.getTotalNumberOfUncles()
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

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
