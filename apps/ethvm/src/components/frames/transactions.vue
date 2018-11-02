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
    <v-layout row wrap justify-space-between class="mb-4">
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
    <v-layout  row justify-center class="ma-1">
   <block-last-transactions :transactions="txs" :showHeader="true" class="mt-3"></block-last-transactions>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events as sEvents } from 'ethvm-models'
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
    this.transactions = this.$store.getters.getTxs

    this.$eventHub.$on(sEvents.newTx, _transactions => {
      this.transactions = this.$store.getters.getTxs
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
