<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-uncles :uncles="uncles" page-type="uncles" :loading="loading" />
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
  page = 0
  loading = true
  error = false

  // Lifecycle
  mounted() {
    this.fetchUncles(this.page).then(res => {
      this.uncles = this.uncles.concat(res)
      this.loading = false
    })
  }

  // Methods
  fetchUncles(page: number, limit = MAX_ITEMS): Promise<Uncle[]> {
    return this.$api.getUncles(limit, page)
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
}
</script>
