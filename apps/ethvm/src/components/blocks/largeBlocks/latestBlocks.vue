<template>
  <v-card color="white" flat class="pt-3 pr-4 pl-4 mt-0">
    <v-layout v-if="showStyle == ''" row wrap align-center pb-1>
      <v-flex d-flex xs12 sm8 order-xs1>
        <v-card-title class="title font-weight-bold">{{getTitle}}</v-card-title>
      </v-flex>
      <v-flex hidden-sm-and-down md4 order-xs2>
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
    <v-card v-if="blocks" flat id="scroll-target" :style="getStyle" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target class="pt-1" style="margin-right: 1px">
        <v-flex xs12>
          <transition-group name="list" tag="p">
          <v-card v-for="block in blocks" class="transparent" flat v-bind:key="block.getHash()">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
              <v-flex xs6 sm2 order-xs1>
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
            <v-layout row v-if="hasUncles(block)"  pl-3 pr-2 pt-0 pb-1>
              <v-flex d-flex hidden-xs-only sm2 pt-0 pr-0>
                <v-img v-if="hasUncles(block)" :src="require('@/assets/uncle.png')" height="30px" contain></v-img>
              </v-flex>
              <v-flex xs12 sm7 md6>
                <v-card flat color="uncleGrey">
                  <v-card-title class="pt-1 font-weight-medium">Uncles:</v-card-title>
                  <v-card-text v-for="(uncle, index) in block.getUncles" :key="index" class="text-truncate info--text">Hash:
                     <router-link :to="'/block/'+'0x'+ uncle.unclesHash">
                    0x{{uncle.unclesHash}}
                  </router-link>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex hidden-xs-only sm3 md4>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card>
          </transition-group>
        </v-flex>
      </v-layout>
    </v-card>
    <div v-else>
      <v-card flat mb-4>
        <v-card-text class="text-xs-center text-muted">{{ $t('message.error')}} </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TablesLatestBlocks',
  props: {
    frameBlocks: {
      type: Boolean,
      default: true
    },
    showStyle: {
      type: String,
      default: ''
    },
    blocks: {
      type: Array
    }
  },
  data() {
    return {
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
    },
    hasUncles(block) {
      return block.getUncles.length > 0
    }
  },
  computed: {
    getStyle() {
      return this.showStyle
    },
    getTitle() {
      return this.frameBlocks ? this.$i18n.t('title.blocks') : this.$i18n.t('title.uncles')
    }
  }
})
</script>
