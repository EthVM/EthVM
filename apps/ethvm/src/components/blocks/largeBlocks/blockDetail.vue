<template>
  <v-card color="white" flat class="pt-3">
    <v-layout wrap row align-center justify-start pb-1>
      <v-flex xs3 sm2 md1>
        <v-layout align-center justify-start>
          <v-btn flat color="primary" class="black--text" icon :to="previousBlock()"> <v-icon>fas fa-angle-left</v-icon> </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs6 sm8 md10 pl-0>
        <v-layout row wrap align-center justify-start pl-0>
          <v-card-title class="title font-weight-bold">{{ $t('title.blockDetail') }}</v-card-title>
          <v-dialog v-if="hasUncles" v-model="dialog" max-width="700">
            <v-btn round outline slot="activator" color="primary" class="text-capitalize" small
              >Unlces
              <v-icon right>fa fa-angle-right</v-icon>
            </v-btn>
            <v-card>
              <v-card-title class="title font-weight-bold">Uncles:</v-card-title>
              <v-divider class="lineGrey"></v-divider>
              <v-list>
                <v-list-tile v-for="(uncle, index) in uncles" :key="index">
                  <v-layout row justify-start align-center fill-height>
                    <v-card-title class="info--text pr-0 pl-0">{{ $t('common.hash') }}:</v-card-title>
                    <v-card-text class="text-truncate">
                      <router-link :to="'/block/' + uncles[index]"> 0x{{ uncles[index].unclesHash }} </router-link>
                    </v-card-text>
                  </v-layout>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-flex>
      <v-flex xs3 sm2 md1>
        <v-layout align-center justify-end>
          <v-btn flat color="primary" class="black--text" icon :to="nextBlock()"> <v-icon>fas fa-angle-right</v-icon> </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-divider class="lineGrey"></v-divider>
    <v-list>
      <v-list-tile v-for="(item, index) in items" :key="index" :class="[index % 2 == 0 ? 'background: white' : 'background: tableGrey']">
        <v-layout align-center justify-start row fill-height class="pa-3 ">
          <v-flex xs4 sm3 md2>
            <v-list-tile-title class="info--text font-weight-medium">{{ item.title }}</v-list-tile-title>
          </v-flex>
          <v-flex xs7 sm8 md9>
            <v-list-tile-title v-if="!item.link" class="text-muted text-truncate"
              >{{ item.detail }} <timeago v-if="item.title == $t('common.timestmp')" :since="block.getTimestamp()" :auto-update="10"></timeago>
            </v-list-tile-title>
            <router-link v-else :to="item.link">
              <v-list-tile-title class="text-truncate">{{ item.detail }}</v-list-tile-title>
            </router-link>
          </v-flex>
          <v-flex xs1>
            <v-list-tile-action v-if="item.copy"> <copy-to-clip-component :valueToCopy="item.detail"></copy-to-clip-component> </v-list-tile-action>
          </v-flex>
        </v-layout>
      </v-list-tile>
      <v-slide-y-transition group>
        <v-list-tile v-if="more" v-for="(item, count) in moreItems" :key="count" :class="[count % 2 == 0 ? 'background: white' : 'background: tableGrey']">
          <v-layout align-center justify-start row fill-height class="pa-3">
            <v-flex xs4 sm3 md2>
              <v-list-tile-title class="info--text font-weight-medium">{{ item.title }}</v-list-tile-title>
            </v-flex>
            <v-flex xs7 sm8 md9>
              <v-list-tile-title v-if="!item.link" class="text-muted text-truncate"
                >{{ item.detail }} <timeago v-if="item.title == $t('common.timestmp')" :datetime="block.getTimestamp()" :auto-update="10"></timeago>
              </v-list-tile-title>
              <router-link v-else :to="item.link">
                <v-list-tile-title class="text-truncate">{{ item.detail }}</v-list-tile-title>
              </router-link>
            </v-flex>
            <v-flex xs1>
              <v-list-tile-action v-if="item.copy"> <copy-to-clip-component :valueToCopy="item.detail"></copy-to-clip-component> </v-list-tile-action>
            </v-flex>
          </v-layout>
        </v-list-tile>
      </v-slide-y-transition>
    </v-list>
    <v-btn v-if="!more" v-on:click="setView()" flat block class="secondary"> <v-icon class="fa fa-angle-down white--text"></v-icon> </v-btn>
    <v-btn v-else v-on:click="setView()" flat block class="secondary"> <v-icon class="fa fa-angle-up white--text"></v-icon> </v-btn>
  </v-card>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import store from '@app/states'
import Vue from 'vue'
import ethUnits from 'ethereumjs-units'
import Bn from 'bignumber.js'

export default Vue.extend({
  name: 'BlockView',
  props: ['block', 'uncles'],
  data() {
    return {
      showMore: false,
      items: [],
      moreItems: [],
      dialog: false,
      hash: '0x9da34191b2d785bc6dcdc40707a1d18c6b0d1d596350b418d815cdc103741fc6'
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
          detail: this.block.getTimestamp()
        },
        {
          title: this.$i18n.t('block.reward'),
          detail: ethUnits.convert(new Bn(this.block.getTotalReward()).toFixed(), 'wei', 'eth') + ' ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('block.pHash'),
          detail: this.block.getParentHash(),
          link: '/block/' + this.block.getParentHash()
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
          details: this.block.getDifficulty()
        },
        {
          title: this.$i18n.t('block.totalDiff'),
          details: this.block.getTotalDifficulty()
        },
        {
          title: this.$i18n.t('block.nonce'),
          details: this.block.getNonce()
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
            title: this.$i18n.t('block.root'),
            details: this.block.getStateRoot().toString()
          },
          {
            title: this.$i18n.t('block.fees'),
            detail: ethUnits.convert(new Bn(this.block.getTxFees()), 'wei', 'eth') + ' ' + this.$i18n.t('common.eth')
          },
          {
            title: this.$i18n.t('gas.limit'),
            detail: this.block.getGasLimit()
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
            detail: ethUnits.convert(new Bn(this.block.getUncleReward()).toFixed(), 'wei', 'eth') + ' ' + this.$i18n.t('common.eth')
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
    },
    nextBlock() {
      const next = this.block.getNumber() + 1
      return '/block/' + next.toString()
    },
    previousBlock() {
      const prev = this.block.getNumber() - 1
      return '/block/' + prev.toString()
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
    },
    hasUncles() {
      if (!this.block.getIsUncle()) {
        return this.block.getHasUncle()
      }
      return false
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
