<template>
  <v-card class="mt-3 mb-5">
    <v-list dense>
      <div v-for="(item,index) in items">
        <v-list-tile :key="item.title" class="pl-1 pr-1">
          <v-layout justify-start>
            <v-flex xs4 sm3 md2>
              <v-list-tile-title><strong>{{item.title}}</strong></v-list-tile-title>
            </v-flex>
            <v-flex xs7 sm8 md9>
              <p v-if="item.title == $t('common.status')" :class="statusColor">{{item.detail}}</p>
              <p v-else-if="!item.link" class="text-muted text-truncate">{{item.detail}}
                <timeago v-if="item.title == $t('common.timestmp')" :since="tx.getTimestamp()" :auto-update="10"></timeago>
              </p>
              <router-link v-else :to="item.link">
                <p class="text-truncate">{{item.detail}}</p>
              </router-link>
            </v-flex>
            <v-flex xs1>
              <v-list-tile-action v-if="item.copy">
                <copy-to-clip-component :valueToCopy="item.detail"></copy-to-clip-component>
              </v-list-tile-action>
            </v-flex>
          </v-layout>
        </v-list-tile>
        <v-divider  v-if="index + 1 < items.length" class="ma-0" :key="index"></v-divider>
      </div>
    </v-list>
  </v-card>
</template>






</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import store from '@app/states'
import Vue from 'vue'

export default Vue.extend({
  name: 'TxView',
  props: ['tx'],
  data() {
    return {
      items: [],
      statusColor: 'success--text'
    }
  },
  methods: {
    getStringStatus(isBool) {
      if (isBool) {
        return 'Successful'
      }
      this.statusColor = 'warning--text'
      return 'Failed'
    },
    getTxCost(price, used) {
      return price * used
    },
    setItems() {
      this.items = [
        {
          title: this.$i18n.t('common.hash'),
          detail: this.tx.getHash().toString(),
          copy: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.tx.getTimestamp().toString()
        },
        {
          title: this.$i18n.t('tx.from'),
          detail: this.tx.getFrom(),
          copy: true,
          link: '/address/' + this.tx.getFrom()
        }
      ]
      if (this.tx.getContractAddress()) {
        const item = {
          title: this.$i18n.t('tx.to') + ' ' + this.$i18n.t('tx.contract'),
          detail: this.tx.getContractAddress(),
          copy: true,
          link: '/address/' + this.tx.getContractAddress()
        }
        this.items.push(item)
      } else {
        const item = {
          title: this.$i18n.t('tx.to'),
          detail: this.tx.getTo(),
          copy: true,
          link: '/address/' + this.tx.getTo()
        }
        this.items.push(item)
      }
      const moreItems = [
        {
          title: this.$i18n.t('tx.amount'),
          detail:
            this.tx
              .getValue()
              .toEth()
              .toString() +
            ' ' +
            this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('tableHeader.blockN'),
          detail: this.tx.getBlockNumber(),
          link: '/block/' + this.tx.getBlockHash().toString()
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: this.tx.getGas().toNumber()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: this.tx.getGasUsed().toNumber()
        },
        {
          title: this.$i18n.t('gas.price'),
          detail: this.tx.getGasPrice().toGWei()
        },
        {
          title: this.$i18n.t('tx.cost'),
          detail: this.getTxCost(this.tx.getGasPrice().toEth(), this.tx.getGasUsed().toNumber()) + ' ' + this.$i18n.t('common.eth')
        }
      ]
      moreItems.forEach(i => {
        this.items.push(i)
      })
    }
  },
  mounted() {
    this.setItems()
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
