<template>
  <v-card color="white" flat class="pt-3">
    <v-layout wrap row align-center pb-1 pr-4 pl-4>
      <v-card-title class="title font-weight-bold">{{ $t('title.txDetail') }}</v-card-title>
    </v-layout>
    <v-divider class="lineGrey"></v-divider>
    <v-list>
      <v-list-tile v-for="(item, index) in items" :key="index" :class="[ index % 2 == 0 ?'background: white' : 'background: tableGrey']">
        <v-layout align-center justify-start row fill-height class="pa-3 ">
          <v-flex xs4 sm3 md2>
            <v-list-tile-title class="info--text font-weight-medium">{{item.title}}
            </v-list-tile-title>
          </v-flex>
          <v-flex xs7 sm8 md9>
            <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">{{item.detail}}
              <timeago v-if="item.title == $t('common.timestmp')" :since="tx.getTimestamp()" :auto-update="10"></timeago>
            </v-list-tile-title>
            <router-link v-else :to="item.link">
              <v-list-tile-title class="text-truncate">{{item.detail}}</v-list-tile-title>
            </router-link>
          </v-flex>
          <v-flex xs1>
            <v-list-tile-action v-if="item.copy">
              <copy-to-clip-component :valueToCopy="item.detail"></copy-to-clip-component>
            </v-list-tile-action>
          </v-flex>
        </v-layout>
      </v-list-tile>
      <v-slide-y-transition group>
        <v-list-tile v-if="showMore" v-for="(item,count) in moreItems" :key="count" :class="[ count % 2 == 0 ?'background: white' : 'background: tableGrey']">
          <v-layout align-center justify-start row fill-height class="pa-3">
            <v-flex xs4 sm3 md2>
              <v-list-tile-title class="info--text font-weight-medium">{{item.title}}</v-list-tile-title>
            </v-flex>
            <v-flex xs7 sm8 md9>
              <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">{{item.detail}}
                <timeago v-if="item.title == $t('common.timestmp')" :since="tx.getTimestamp()" :auto-update="10"></timeago>
              </v-list-tile-title>
              <router-link v-else :to="item.link">
                <v-list-tile-title class="text-truncate">{{item.detail}}</v-list-tile-title>
              </router-link>
            </v-flex>
            <v-flex xs1>
              <v-list-tile-action v-if="item.copy">
                <copy-to-clip-component :valueToCopy="item.detail"></copy-to-clip-component>
              </v-list-tile-action>
            </v-flex>
          </v-layout>
        </v-list-tile>
      </v-slide-y-transition>
    </v-list>
    <v-btn v-if="!showMore" v-on:click="setView()" flat block class="secondary">
      <v-icon class="fa fa-angle-down white--text"></v-icon>
    </v-btn>
    <v-btn v-else v-on:click="setView()" flat block class="secondary">
      <v-icon class="fa fa-angle-up white--text"></v-icon>
    </v-btn>
  </v-card>
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
      moreItems: [],
      statusColor: 'success--text',
      showMore: false
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
          detail: this.tx.getHash(),
          copy: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.tx.getTimestamp()
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
      const amount = {
        title: this.$i18n.t('tx.amount'),
        detail:
          this.tx
            .getValue()
            .toEth()
            .toString() +
          ' ' +
          this.$i18n.t('common.eth')
      }
      this.items.push(amount)
    },
    setMore() {
      const items = [
        {
          title: this.$i18n.t('tableHeader.blockN'),
          detail: this.tx.getBlockNumber(),
          link: '/block/' + this.tx.getBlockHash()
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: this.tx.getGas()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: this.tx.getGasUsed()
        },
        {
          title: this.$i18n.t('gas.price'),
          detail: this.tx.getGasPrice()
        },
        {
          title: this.$i18n.t('tx.cost'),
          detail: this.getTxCost(this.tx.getGasPrice(), this.tx.getGasUsed()) + ' ' + this.$i18n.t('common.eth')
        }
      ]
      items.forEach(i => {
        this.moreItems.push(i)
      })
    },
    setView() {
      this.showMore = !this.showMore
    }
  },
  mounted() {
    this.setItems()
    this.setMore()
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
