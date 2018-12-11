<template>
  <v-container grid-list-lg class="mt-0">
    <bread-crumbs :newItems="items"></bread-crumbs>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 md6 lg3>
        <block-last-block></block-last-block>
      </v-flex>
      <v-flex xs12 md6 lg3>
        <successful-tx-small-block></successful-tx-small-block>
      </v-flex>
      <v-flex xs12 md6 lg3>
        <failed-tx-small-block></failed-tx-small-block>
      </v-flex>
      <v-flex xs12 md6 lg3>
        <pending-tx-small-block></pending-tx-small-block>
      </v-flex>
    </v-layout>
    <v-layout row justify-center mb-4>
      <v-flex xs12>
        <block-last-transactions :transactions="txs" :frameTxs="true"></block-last-transactions>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events as sEvents } from 'ethvm-common'
import Vue from 'vue'
const MAX_ITEMS = 20

export default Vue.extend({
  name: 'FramesHome',
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.mined'),
          disabled: true
        }
      ]
    }
  },
  computed: {
    txs() {
      let tx
      tx = this.$store.getters.getTxs
      this.$eventHub.$on(sEvents.newTx, _transactions => {
        tx = this.$store.getters.getTxs
        return tx.slice(0, MAX_ITEMS)
      })
      return tx.slice(0, MAX_ITEMS)
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
