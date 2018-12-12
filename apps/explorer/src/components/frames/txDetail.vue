<template>
  <v-container v-if="transaction != null" grid-list-lg class="mb-0">
    <bread-crumbs :newItems="getItems"></bread-crumbs>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <block-tx-detail :tx="transaction"></block-tx-detail>
      </v-flex>
    </v-layout>
    <!--
      Get Sub Tx
      <div v-if>
        <h4>Sub Transactions</h4>
        <block-last-transactions :tx="transactions"></block-last-transactions>
      </div>
    -->
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import store from '@app/states'
import Vue from 'vue'
import { Block, Tx } from '@app/models'
import { Events as sEvents } from 'ethvm-common'

export default Vue.extend({
  name: 'tx-Detail',
  props: ['txHash'],
  data() {
    return {
      store,
      common,
      transaction: null,
      unixtimestamp: null,
      timestamp: null,
      items: [
        {
          text: this.$i18n.t('title.tx'),
          disabled: false,
          link: '/transactions'
        },
        {
          text: this.$i18n.t('common.tx') + ': ' + this.txHash,
          disabled: true
        }
      ]
    }
  },
  mounted() {
    /* Get Tx Info */
    this.$socket.emit(
      sEvents.getTx,
      {
        hash: this.txHash.replace('0x', '')
      },
      (err, data) => {
        if (data) {
          this.transaction = new Tx(data)
          /* Method to get Subtransactions: */
        }
      }
    )
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
