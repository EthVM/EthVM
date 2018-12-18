<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs/>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm6 md3>
        <app-info-card
          :title="$t('smlBlock.last')"
          :value="latestBlockNumber"
          colorType="primary white--text"
          backType="last-block"
        ></app-info-card>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card
          :title="$t('smlBlock.time')"
          :value="secSinceLastBlock"
          colorType="primary white--text"
          backType="success"
          metrics="sec"
        ></app-info-card>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card
          :title="$t('smlBlock.hashR')"
          :value="latestHashRate"
          colorType="warning white--text"
          backType="hash-rates"
          metrics="Th/s"
        ></app-info-card>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card
          :title="$t('smlBlock.diff')"
          :value="latestDifficulty"
          colorType="error white--text"
          backType="difficulty"
          metrics="Th"
        ></app-info-card>
      </v-flex>
    </v-layout>
    <!-- Charts -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12 md6>
        <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
      </v-flex>
      <v-flex xs12 md6>
        <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
      </v-flex>
    </v-layout>
    <!-- End Charts -->
    <!-- Last Blocks -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks
          v-if="blocks"
          :maxBlocks="true"
          :blocks="blocks"
          showStyle="max-height: 590px"
        ></table-blocks>
      </v-flex>
    </v-layout>
    <!-- End Last Blocks -->
    <!-- Last Txs -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-transactions :transactions="txs" showStyle="max-height: 590px"></table-transactions>
      </v-flex>
    </v-layout>
    <!-- End Last Txs -->
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Visibility from 'visibilityjs'
import { Events } from 'ethvm-common'
import BN from 'bignumber.js'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import AppInfoCard from '@app/components/ui/AppInfoCard.vue'
import TableBlocks from '@app/components/tables/TableBlocks.vue'
import TableTransactions from '@app/components/tables/TableTransactions.vue'
import { lastBlockInfo } from '@app/components/mixins/mixin-last-block-stats'
import { Events as sEvents } from 'ethvm-common'
import { Block, Tx, PendingTx } from '@app/models'

export default Vue.extend({
  name: 'FramesHome',
  components: {
    AppBreadCrumbs,
    TableBlocks,
    TableTransactions,
    AppInfoCard
  },
  mixins: [lastBlockInfo],
  data() {
    return {
      blocks: null
    }
  },
  created() {
    this.blocks = this.$store.getters.getBlocks

    this.$eventHub.$on(Events.newBlock, _block => {
      if (Visibility.state() === 'visible') {
        this.blocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      }
    })
    this.$options.sockets.connect = () => {
      if (!this.pageName || this.pageName === 'blocks' || this.pageName === 'transactions') {
        this.setPastData()
      } else {
        setTimeout(() => {
          this.setPastData()
        }, 1000)
      }
    }
  },
  beforeDestroy() {
    this.$eventHub.$off(Events.newBlock)
  },
  computed: {
    txs() {
      if (this.$store.getters.getTxs.length) {
        return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
      }
      return []
    }
  },
  methods: {
    setPastData() {
      this.$socket.emit(
        sEvents.pastTxs,
        {
          limit: 100,
          page: 0
        },
        (err, txs) => {
          this.$store.commit(sEvents.newTx, txs)
          if (txs && txs.length > 0) {
            this.$eventHub.$emit(sEvents.pastTxsR)
            this.$eventHub.$emit(sEvents.newTx, new Tx(txs[0]))
          }
        }
      )
      this.$socket.emit(
        sEvents.pastBlocks,
        {
          limit: 100,
          page: 0
        },
        (err, blocks) => {
          this.$store.commit(sEvents.newBlock, blocks)
          if (blocks && blocks.length > 0) {
            this.$eventHub.$emit(sEvents.newBlock, new Block(blocks[0]))
            this.$eventHub.$emit(sEvents.pastBlocksR)
          }
        }
      )
      this.$socket.emit(
        sEvents.pendingTxs,
        {
          limit: 100,
          page: 0
        },
        (err, pTxs) => {
          this.$store.commit(sEvents.newPendingTx, pTxs)
          if (pTxs && pTxs.length > 0) {
            this.$eventHub.$emit(sEvents.newPendingTx)
          }
        }
      )

      this.$socket.emit(
        sEvents.getUncles,
        {
          limit: 100,
          page: 0
        },
        (err, uncles) => {
          this.$store.commit(sEvents.newUncle, uncles)
          if (uncles && uncles.length > 0) {
            this.$eventHub.$emit(sEvents.newUncle)
          }
        }
      )
    }
  }
})
</script>
