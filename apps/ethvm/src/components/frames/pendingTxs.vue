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
    <block-last-transactions :transactions="pendingTxs" :showHeader="true" class="mt-3" :pending="true">{{getLength}}</block-last-transactions>
  </v-container>
</template>

<script lang="ts">
import sEvents from '@app/configs/socketEvents.json'
import { Tx } from '@app/models'
import bn from 'bignumber.js'
import Visibility from 'visibilityjs'
import Vue from 'vue'

const getOverview = (arr: Tx[]) => {
  const overview = {
    totalGasPrice: new bn(0),
    totalValue: new bn(0),
    length: 0,
    totalFees: new bn(0),
    topSenders: []
  }
  const senders = {}
  arr.forEach((_tx: Tx) => {
    overview.totalGasPrice = overview.totalGasPrice.add(_tx.getGasPrice().toWei())
    overview.totalValue = overview.totalValue.add(_tx.getValue().toWei())
    overview.totalFees = overview.totalFees.add(new bn(_tx.getGasPrice().toWei()).mul(_tx.getGasUsed().toNumber()))
    if (senders[_tx.getFrom().toString()]) {
      senders[_tx.getFrom().toString()] = senders[_tx.getFrom().toString()].add(_tx.getValue().toWei())
    } else {
      senders[_tx.getFrom().toString()] = new bn(_tx.getValue().toWei())
    }
  })
  const tempArr = []
  for (const add in senders) {
    if (senders.hasOwnProperty(add)) {
      tempArr.push({
        address: add,
        value: senders[add]
      })
    }
  }
  tempArr.sort((a, b) => {
    if (a.value.gt(b.value)) {
      return -1
    }
    return 1
  })
  overview.length = arr.length
  overview.topSenders = tempArr.slice(0, 10)
  return overview
}

export default Vue.extend({
  name: 'LatestPendingTransactions',
  data() {
    return {
      pendingTxs: [],
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
  created() {
    this.$emit('updated', getOverview(this.pendingTxs))
    this.$socket.emit(sEvents.join, 'pendingTxs')
    this.$options.sockets.newPendingTx = data => {
      if (Visibility.state() === 'visible') {
        this.pendingTxs.unshift(new Tx(data))
        this.$emit('updated', getOverview(this.pendingTxs))
      }
    }
  },
  beforeDestroy() {
    this.$socket.emit(sEvents.leave, 'pendingTxs')
  },
  methods: {
    getLength() {
      console.log(this.pendingTxs)
    }
  }
})
</script>
