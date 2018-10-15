<template>
  <v-card color="white" flat class="pt-3">
    <v-layout wrap row align-center pb-1 pr-4 pl-4>
      <v-card-title class="title font-weight-bold">{{ $t('title.blockDetail') }}</v-card-title>
    </v-layout>
    <v-divider class="lineGrey"></v-divider>
    <v-list>
      <v-list-tile v-for="(item, index) in items" :key="index" :class="[ index % 2 == 0 ?'background: white' : 'background: tableGrey']">
        <v-layout align-center justify-start row fill-height class="pa-3 ">
          <v-flex xs4 sm3 md2>
            <v-list-tile-title class="info--text font-weight-medium">{{item.title}}</v-list-tile-title>
          </v-flex>
          <v-flex xs7 sm8 md9>
            <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">{{item.detail}}
              <timeago v-if="item.title == $t('common.timestmp')" :since="block.getTimestamp()" :auto-update="10"></timeago>
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
          <v-list-tile v-if="more" v-for="(item,count) in moreItems" :key="count" :class="[ count % 2 == 0 ?'background: white' : 'background: tableGrey']">
            <v-layout align-center justify-start row fill-height class="pa-3">
              <v-flex xs4 sm3 md2>
                <v-list-tile-title class="info--text font-weight-medium">{{item.title}}</v-list-tile-title>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">{{item.detail}}
                  <timeago v-if="item.title == $t('common.timestmp')" :since="block.getTimestamp()" :auto-update="10"></timeago>
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
    <v-btn v-if="!more" v-on:click="setView()" flat block class="secondary">
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
  name: 'BlockView',
  props: ['block', 'uncles'],
  data() {
    return {
      showMore: false,
      items: [],
      moreItems: []
    }
  },
  methods: {
    setView() {
      this.showMore = !this.showMore
    },
    setItems() {
      const newItems = [
        {
          title: this.$i18n.t('block.height'),
          detail: this.block.getNumber()
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: this.block.getHash(),
          copy: true
        },
        {
          title: this.$i18n.t('block.miner'),
          detail: this.block.getMiner(),
          link: '/address/' + this.block.getMiner(),
          copy: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.block.getTimestamp().toString()
        },
        {
          title: this.$i18n.t('block.reward'),
          detail:
            this.block
              .getBlockReward()
              .toEth()
              .toString() +
            ' ' +
            this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('block.pHash'),
          detail: this.block.getParentHash(),
          link: '/block/' + this.block.getParentHash()
        },
        {
          title: this.$i18n.t('block.size'),
          detail: 'TODO'
        }
      ]
      if (!this.isUncle) {
        const item = {
          title: this.$i18n.t('title.tx'),
          detail: this.block.getTransactionCount()
        }
        newItems.push(item)
      }
      this.items = newItems
    },
    setMore() {
      this.moreItems = [
        {
          title: this.$i18n.t('block.diff'),
          details: this.block.getDifficulty().toNumber()
        },
        {
          title: this.$i18n.t('block.totalDiff'),
          details: this.block.getTotalDifficulty().toNumber()
        },
        {
          title: this.$i18n.t('block.nonce'),
          details: this.block.getNonce().toString()
        },
        {
          title: this.$i18n.t('block.root'),
          details: this.block.getStateRoot().toString()
        },
        {
          title: this.$i18n.t('block.data'),
          details: this.block.getExtraData().toString()
        }
      ]

      if (!this.isUncle) {
        const newItems = [
          {
            title: this.$i18n.t('block.totalReward'),
            detail: '' //this.block.getBlockReward().toEth() + ' ' + this.$i18n.t('common.eth')
          },
          {
            title: this.$i18n.t('block.fees'),
            detail: this.block.getTxFees().toEth() + ' ' + this.$i18n.t('common.eth')
          },
          {
            title: this.$i18n.t('gas.limit'),
            detail: this.block.getGasLimit().toNumber()
          },
          {
            title: this.$i18n.t('gas.used'),
            detail: this.block.getGasUsed()
          },
          {
            title: this.$i18n.t('block.logs'),
            detail: this.block.getLogsBloom().toString()
          },
          {
            title: this.$i18n.t('block.txRoot'),
            detail: this.block.getTransactionsRoot().toString()
          },
          {
            title: this.$i18n.t('block.recRoot'),
            detail: this.block.getReceiptsRoot().toString()
          },
          {
            title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.uncReward'),
            detail:
              this.block
                .getUncleReward()
                .toEth()
                .toString() +
              ' ' +
              this.$i18n.t('common.eth')
          },
          {
            title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.sha'),
            detail: this.block.getSha3Uncles()
          }
        ]
        newItems.forEach(i => {
          this.moreItems.push(i)
        })
      }
    }
  },
  mounted() {
    this.setItems()
    this.setMore()
  },
  computed: {
    isUncle() {
      return this.block.getIsUncle()
    },
    update() {
      return String
    },
    more() {
      return this.showMore
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
