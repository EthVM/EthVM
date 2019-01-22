<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-uncles :uncles="uncles" page-type="uncles" :loading="uncleLoad" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events } from 'ethvm-common'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TableUncles from '@app/modules/uncles/components/TableUncles.vue'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableUncles
  }
})
export default class PageUncles extends Vue {
  // Lifecycle
  created() {
    this.$socket.emit(
      Events.getUncles,
      {
        limit: 100,
        page: 0
      },
      (err, uncles) => {
        this.$store.commit(Events.newUncle, uncles)
        if (uncles && uncles.length > 0) {
          this.$eventHub.$emit(Events.newUncle)
        }
      }
    )
  }

  // Computed
  get uncles() {
    return this.$store.getters.uncles.slice(0, MAX_ITEMS)
  }

  get uncleLoad(): boolean {
    return this.uncles.length == 0
  }

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
