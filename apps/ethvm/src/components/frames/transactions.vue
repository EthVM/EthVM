<template>
  <v-container grid-list-lg class="pa-0 mt-0 mb-0">
    <v-layout row wrap mb-4>
      <v-flex xs12>
        <v-breadcrumbs large>
          <v-icon slot="divider">fa fa-arrow-right</v-icon>
          <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link"> {{ item.text }} </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 md6 lg3> <block-last-block></block-last-block> </v-flex>
      <v-flex xs12 md6 lg3> <successful-tx-small-block></successful-tx-small-block> </v-flex>
      <v-flex xs12 md6 lg3> <failed-tx-small-block></failed-tx-small-block> </v-flex>
      <v-flex xs12 md6 lg3> <pending-tx-small-block></pending-tx-small-block> </v-flex>
    </v-layout>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <block-last-transactions :transactions="txs" :frameTxs="true"></block-last-transactions> </v-flex>
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
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
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
