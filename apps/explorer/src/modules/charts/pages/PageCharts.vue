<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs"></app-bread-crumbs>
    <app-tabs :tabs="pageTabs">
      <!-- Live Data-->
      <v-tab-item slot="tabs-item" value="tab-0">
        <v-layout row wrap justify-space-between mb-4>
          <v-flex xs12 sm6 md3><app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" color-type="primary" back-type="last-block"/></v-flex>
          <v-flex xs12 sm6 md3
            ><app-info-card :title="$t('smlBlock.time')" :value="secSinceLastBlock" color-type="success" back-type="time-since" metrics="sec"
          /></v-flex>
          <v-flex xs12 sm6 md3
            ><app-info-card :title="$t('smlBlock.hashR')" :value="latestHashRate" color-type="warning" back-type="hash-rate" metrics="Th/s"
          /></v-flex>
          <v-flex xs12 sm6 md3
            ><app-info-card :title="$t('smlBlock.diff')" :value="latestDifficulty" color-type="error" back-type="difficulty" metrics="Th"
          /></v-flex>
        </v-layout>
        <!-- Charts -->
        <v-layout row wrap justify-center mb-4>

      <v-flex xs12 md6> <chart-live-tx /> </v-flex>
      <v-flex xs12 md6> <chart-live-tx-fees /> </v-flex>

        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6><!-- Average Block Time --></v-flex>
          <v-flex xs12 md6><!-- Difficulty --></v-flex>
        </v-layout>
      </v-tab-item>
      <!-- Transactions-->
      <v-tab-item slot="tabs-item" value="tab-1">
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6><!-- Average Gas Price --></v-flex>
          <v-flex xs12 md6><!-- Average Gas Limit --></v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6><!-- Average Tx Fees --></v-flex>
          <v-flex xs12 md6><!-- Pending Txs --></v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6><!-- Sucessful Txs --></v-flex>
          <v-flex xs12 md6><!--Failed Txs --></v-flex>
        </v-layout>
      </v-tab-item>
      <!-- Blocks -->
      <v-tab-item slot="tabs-item" value="tab-2">
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6>
                  <v-img :src="require('@/assets/chart.png')"  contain class="ma-4"></v-img>
  <v-btn flat color="secondary" class="text-capitalize" :to="'/chart/' + ID.blockTime"
            >{{ $t('bttn.more') }} <v-icon right>fas fa-angle-right</v-icon></v-btn
          >
          </v-flex>
          <v-flex xs12 md6><!-- Average Block Size --></v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6> <v-img :src="require('@/assets/chart.png')"  contain class="ma-4"></v-img>
  <v-btn flat color="secondary" class="text-capitalize" :to="'/chart/' + ID.difficulty"
            >{{ $t('bttn.more') }} <v-icon right>fas fa-angle-right</v-icon></v-btn
          ></v-flex>
        </v-layout>
      </v-tab-item>
      <!-- Mining -->
      <v-tab-item slot="tabs-item" value="tab-3">
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6><!-- Hash Rate --></v-flex>
          <v-flex xs12 md6><!-- Mining rewards --></v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6><!-- Historic top Miners --></v-flex>
        </v-layout>
      </v-tab-item>
    </app-tabs>
  </v-container>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import ChartLiveTx from '@app/modules/charts/components/live/ChartLiveTx.vue'
import ChartLiveTxFees from '@app/modules/charts/components/live/ChartLiveTxFees.vue'
import { LastBlockInfoMixin } from '@app/core/components/mixins'
import id from '@app/modules/charts/helpers/index.ts'
import { Vue, Component, Mixins } from 'vue-property-decorator'

const MAX_ITEMS = 20

@Component({
  components: {
    AppBreadCrumbs,
    AppTabs,
    AppInfoCard,
    ChartLiveTx,
    ChartLiveTxFees
  }
})
export default class PageCharts extends Mixins(LastBlockInfoMixin) {
  ID = id
  data() {
    return {
      crumbs: [
        {
          text: this.$i18n.t('title.charts'),
          disabled: true
        }
      ],
      pageTabs: [
        {
          id: '0',
          title: this.$i18n.t('tabs.live'),
          isActive: true
        },
        {
          id: '1',
          title: this.$i18n.t('title.tx'),
          isActive: false
        },
        {
          id: '2',
          title: this.$i18n.t('title.blocks'),
          isActive: false
        },
        {
          id: '3',
          title: this.$i18n.t('tabs.miningH'),
          isActive: false
        }
      ]
    }
  }
}
</script>
