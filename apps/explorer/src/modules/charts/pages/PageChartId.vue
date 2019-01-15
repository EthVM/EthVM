<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs"></app-bread-crumbs>
    <!-- chart-history v-if="chartID === 'chart-history'"/>-->
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 20

@Component({
  components: {
    AppBreadCrumbs
  }
})
export default class PageChartId extends Vue {

  get crumbs() {
    return  [
        {
          text: this.$i18n.t('title.charts'),
          disabled: false,
          link: '/charts'
        },
        {
          text: this.chartID,
          disabled: true
        }
      ]
  }
  get chartID() {
    return this.$route.params.chartID
  }
}
</script>
