<template>
  <v-card color="white" flat class="pt-3 pr-4 pl-4 mt-0">
    <v-layout v-if="frameBlocks" row wrap align-center pb-1>
      <v-flex d-flex xs12 sm8 order-xs1>
        <v-card-title class="title font-weight-bold">{{ $t('title.lastBlock') }}</v-card-title>
      </v-flex>
      <v-flex  hidden-sm-and-down md4 order-xs2>
        <v-layout justify-end>
          <footnote :footnotes="footnote"></footnote>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap align-center pb-1>
      <v-flex d-flex xs8 md7 order-xs1>
        <v-card-title class="title font-weight-bold">{{ $t('title.lastBlock') }}</v-card-title>
      </v-flex>
      <v-flex hidden-sm-and-down md4 order-md2>
        <v-layout justify-center>
          <footnote :footnotes="footnote"></footnote>
        </v-layout>
      </v-flex>
      <v-flex d-flex xs4 md1 order-xs2 order-md3>
        <v-layout justify-end>
          <v-btn outline color="secondary" class="text-capitalize" to="/blocks"> {{ $t('bttn.viewAll') }}</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1" height="40px" style="margin-right: 1px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm2 md3 lg2>
          <h5>{{ $t( 'tableHeader.blockN' ) }}</h5>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t( 'tableHeader.txs' ) }}</h5>
        </v-flex>
        <v-flex xs6 sm3 md2>
          <h5>{{ $t( 'tableHeader.reward' ) }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!--End Table Header-->
    <v-card v-if="getBlocks" flat id="scroll-target" :style="getStyle" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target class="pt-1" style="margin-right: 1px">
        <v-flex xs12>
          <v-card v-for="block in getBlocks" class="transparent" flat  v-bind:key="block.hash">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
              <v-flex d-flex xs6 sm2 order-xs1 >
                <router-link class="black--text pb-1" :to="'/block/'+block.getHash()">{{block.getNumber()}}</router-link>
              </v-flex>
              <v-flex xs12 sm7 md6 lass="pr-0" order-xs3 order-sm2>
                <p class="text-truncate info--text  psmall mb-0 pb-2">{{ $t( 'common.hash' ) }}:
                  <router-link class="primary--text font-italic font-weight-regular" :to="'/block/'+block.getHash()">{{block.getHash()}}</router-link>
                </p>
                <p class="text-truncate info--text  mb-0">{{ $t( 'block.miner' ) }}:
                  <router-link :to="'/address/'+block.getMiner().toString()" class="secondary--text font-italic font-weight-regular">{{block.getMiner().toString()}}</router-link>
                </p>
              </v-flex>
              <v-flex hidden-sm-and-down md2 order-xs4 order-sm3>
                <p class="txSuccess--text mb-0 psmall"> {{block.getStats().successfulTxs}}</p>
                <p class="txFail--text mb-0"> {{block.getStats().failedTxs}}</p>
              </v-flex>
              <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
                <p class="text-truncate black--text align-center mb-0">
                  <v-tooltip v-if="getShortRewardValue(block.getTotalBlockReward(), true)" bottom>
                    <v-icon slot="activator" dark small>fa fa-question-circle info--text</v-icon>
                    <span>{{block.getTotalBlockReward()}}</span>
                  </v-tooltip>
                  {{getShortRewardValue(block.getTotalBlockReward(), false)}}
                </p>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
    <div v-else>
      <v-card mb-4>
        <v-card-text class="text-xs-center text-muted">{{ $t('message.error')}} </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts">
import sEvents from '@app/configs/socketEvents.json'
import Visibility from 'visibilityjs'
import Vue from 'vue'
import BN from 'bignumber.js'

export default Vue.extend({
  name: 'TablesLatestBlocks',
  props: {
    frameBlocks: {
      type: Boolean,
      default: false
    },
    showStyle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      blocks: [],
      showUncles: {},
      background: false,
      footnote: [
        {
          color: 'txSuccess',
          text: this.$i18n.t('footnote.success'),
          icon: 'fa fa-circle'
        },
        {
          color: 'txFail',
          text: this.$i18n.t('footnote.failed'),
          icon: 'fa fa-circle'
        }
      ]
    }
  },
  methods: {
    /* Uncles Methods: */
    showHideUncle(_hash: string) {
      this.$set(this.showUncles, _hash, !this.isUncleShown(_hash))
    },
    isUncleShown(_hash: string) {
      return this.showUncles[_hash] ? this.showUncles[_hash] : false
    },
    /* Method to reduce reward string: */
    getShortRewardValue(newRewardValue, isBool) {
      const length = newRewardValue.length
      let isShort = false
      if (length > 8) {
        newRewardValue = newRewardValue.slice(0, 8) + '...'
        isShort = true
      }
      if (!isBool) {
        return newRewardValue
      }
      return isShort
    }
  },
  created() {
    this.blocks = this.$store.getters.getBlocks

    this.$eventHub.$on(sEvents.newBlock, _block => {
      console.log(this.blocks)
      if (Visibility.state() === 'visible') {
        this.blocks = this.$store.getters.getBlocks
      }
    })
  },
  beforeDestroy() {
    this.$eventHub.$off(sEvents.newBlock)
  },
  computed: {
    getBlocks() {
      return this.blocks.slice(0, this.maxItems)
    },
    getStyle() {
      return this.showStyle
    }
  }
})
</script>
