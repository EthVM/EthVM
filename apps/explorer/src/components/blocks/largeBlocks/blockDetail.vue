<template>
  <v-card color="white" flat class="pt-3">
    <v-layout v-if="!isUncle" wrap row align-center justify-start pb-1>
      <v-flex xs3 sm2 md1>
        <v-layout align-center justify-start>
          <v-btn flat color="primary" class="black--text" icon :to="previousBlock()"> <v-icon>fas fa-angle-left</v-icon> </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs6 sm8 md10 pl-0>
        <v-layout row wrap align-center justify-start pl-0>
          <v-card-title class="title font-weight-bold">{{ $t('title.blockDetail') }}</v-card-title>
          <v-dialog v-if="hasUncles" v-model="dialog" max-width="700">
            <v-btn round outline slot="activator" color="primary" class="text-capitalize" small>
              {{ $t('title.uncles') }}
              <v-icon right>fa fa-angle-right</v-icon>
            </v-btn>
            <v-card>
              <v-card-title class="title font-weight-bold">{{ $t('title.uncles') }}:</v-card-title>
              <v-divider class="lineGrey"></v-divider>
              <v-list>
                <v-list-tile v-for="(uncle, index) in uncles" :key="index">
                  <v-layout row justify-start align-center fill-height>
                    <v-card-title class="info--text pr-0 pl-0">{{ $t('common.hash') }}:</v-card-title>
                    <v-card-text class="text-truncate">
                      <router-link :to="'/uncle/' + uncles[index]">{{ uncles[index] }}</router-link>
                    </v-card-text>
                  </v-layout>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-flex>
      <v-flex v-if="mined" xs3 sm2 md1>
        <v-layout align-center justify-end>
          <v-btn flat color="primary" class="black--text" icon :to="nextBlock()"> <v-icon>fas fa-angle-right</v-icon> </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout v-if="isUncle" wrap row align-center justify-start pb-1>
      <v-flex xs6 sm8 md10>
        <v-layout row wrap align-center justify-start>
          <v-card-title class="title font-weight-bold pl-4">{{ $t('title.uncleDetail') }}</v-card-title>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-divider class="lineGrey"></v-divider>
    <v-list v-if="mined">
      <v-list-tile v-for="(item, index) in items" :key="index" :class="[index % 2 == 0 ? 'background: white' : 'background: tableGrey']">
        <v-layout align-center justify-start row fill-height class="pa-3">
          <v-flex xs4 sm3 md2>
            <v-list-tile-title class="info--text font-weight-medium">{{ item.title }}</v-list-tile-title>
          </v-flex>
          <v-flex xs7 sm8 md9>
            <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">
              <timeago v-if="item.title == $t('common.timestmp')" :datetime="block.getTimestamp()" :auto-update="10"></timeago> {{ item.detail }}
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
              <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">
                {{ item.detail }} <timeago v-if="item.title == $t('common.timestmp')" :datetime="block.getTimestamp()" :auto-update="10"></timeago>
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
    <div v-if="mined">
      <v-btn v-if="!more" v-on:click="setView()" flat block class="secondary"> <v-icon class="fa fa-angle-down white--text"></v-icon> </v-btn>
      <v-btn v-else v-on:click="setView()" flat block class="secondary"> <v-icon class="fa fa-angle-up white--text"></v-icon> </v-btn>
    </div>
    <v-card flat v-else class="pa-3">
      <v-layout column align-center justify-center ma-3>
        <v-icon class="fa fa-spinner fa-pulse fa-4x fa-fw primary--text" large></v-icon>
        <v-card-title v-if="isNotMinedBlock" class="primary--text text-xs-center body-2 pb-4">{{ $t('block.notMined') }}</v-card-title>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import store from '@app/states'
import Vue from 'vue'
import ethUnits from 'ethereumjs-units'
import Bn from 'bignumber.js'
import NumberFormatter from 'number-formatter'

export default Vue.extend({
  name: 'BlockView',
  props: {
    block: {
      type: Object,
      default: null
    },
    isMined: {
      type: Boolean,
      default: true
    },
    prev: {
      type: Number
    },
    uncles: {
      type: Array
    },
    isNotMinedBlock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMore: false,
      items: [],
      moreItems: [],
      dialog: false
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
          detail: this.formatTime
        },
        {
          title: this.$i18n.t('block.reward'),
          detail: common.WeiValue(this.block.getMinerReward()).toEthFormated() + '  ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.uncReward'),
          detail: common.WeiValue(this.block.getUncleReward()).toEthFormated() + ' ' + this.$i18n.t('common.eth')
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
      if (this.isUncle) {
        const item = {
          title: this.$i18n.t('title.position'),
          detail: this.block.getPosition()
        }
        newItems.unshift(item)
      }
      this.items = newItems
    },
    setMore() {
      this.moreItems = [
        {
          title: this.$i18n.t('block.diff'),
          detail: this.block.getDifficulty()
        },
        {
          title: this.$i18n.t('block.totalDiff'),
          detail: this.block.getTotalDifficulty()
        },
        {
          title: this.$i18n.t('block.nonce'),
          detail: this.block.getNonce()
        },
        {
          title: this.$i18n.t('block.root'),
          detail: this.block.getStateRoot().toString()
        },
        {
          title: this.$i18n.t('block.data'),
          detail: this.block.getExtraData().toString()
        }
        /*{
                title: this.$i18n.t('block.data'),
                details: this.block.getExtraData().toString()
              }*/
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
      return this.block ? '/block/' + (this.block.getNumber() - 1).toString() : '/block/' + this.prev.toString()
    }
  },
  computed: {
    isUncle() {
      return this.block && this.block.getIsUncle()
    },
    update() {
      return String
    },
    more() {
      return this.showMore
    },
    hasUncles() {
      return this.block && this.block.getHasUncle()
    },
    mined() {
      if (this.isMined) {
        this.setItems()
        this.setMore()
      }
      return this.isMined
    },
    formatTime() {
      const date = new Date(this.block.getTimestamp()).toString()
      return '(' + date + ')'
    }
  }
})
</script>

<style scoped lang="css"></style>
