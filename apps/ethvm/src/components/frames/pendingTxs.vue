<template>
  <v-container grid-list-lg class="mt-0">
    <v-card fluid flat color="transparent">
      <v-breadcrumbs large>
        <v-icon slot="divider">fa fa-arrow-right</v-icon>
        <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link">
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-card>
    <block-last-transactions :transactions="txs" :showHeader="true" class="mt-3" :pending="true"></block-last-transactions>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@app/configs/socketEvents.json'

const MAX_ITEMS = 20

export default Vue.extend({
  name: 'LatestPendingTransactions',
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
        {
          text: this.$i18n.t('title.pending'),
          disabled: true
        }
      ]
    }
  },
  computed: {
  txs() {
    this.transactions = this.$store.getters.getPendingTxs

    this.$eventHub.$on(sEvents.newPendingTx, _transactions => {
      this.transactions = this.$store.getters.getPendingTxs
      return  this.transactions.slice(0, MAX_ITEMS)
    })
    return  this.transactions.slice(0, MAX_ITEMS)
  },
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
