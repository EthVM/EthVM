<template>
  <v-layout column>
    <v-card flat color="transparent" class="pb-1 mr-1 ml-1">
      <v-layout row justify-center align-center>
        <v-flex xs3 md1>
          <h5 class="ml-3">Uncle#</h5>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex hidden-sm-and-down md1 class="pl-0">
          <h5>{{ $t( 'tableHeader.txs' ) }}</h5>
        </v-flex>
        <v-flex xs4 md2 class="pl-0">
          <h5>{{ $t( 'tableHeader.reward' ) }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <div v-if="getUncles" id="scroll-target" :style="getStyle" class="scroll-y pt-0 mb-3" >
        <v-card v-scroll:#scroll-target v-for="uncle in getUncles" v-bind:key="uncle.hash" class="pt-3 mb-3 elevation-2 mr-1 ml-1">
          <v-layout wrap align-center class="ma-0" >
            <v-flex xs3 md1 >
              <p class="text-xs-center">
                <router-link :to="'/block/'+uncle.getHash()">{{uncle.getHash()}}</router-link>
              </p>
            </v-flex>
            <v-flex xs5 md8 class="pl-1 pr-0">
              <p class="text-truncate"><strong>{{ $t( 'common.hash' ) }} </strong>
                <router-link class=" grey--text text--darken-2" :to="'/uncle/'+uncle.getHash()">{{uncle.getHash()}}</router-link>
              </p>
              <p class="text-truncate"><strong>{{ $t( 'block.miner' ) }}  </strong>
                <router-link :to="'/address/'+uncle.getMiner()">{{uncle.getMiner()}}</router-link>
              </p>
            </v-flex>
          </v-layout>
        </v-card>
    </div>
     <div v-else>
      <v-card class="mt-3 mb-3" >
        <v-card-text class="text-xs-center text-muted">{{ $t('message.error')}} </v-card-text>
      </v-card>
     </div>
    <footnote :footnotes="footnote"></footnote>
  </v-layout>
</template>


<script lang="ts">
import { Events as sEvents } from 'ethvm-models'
import Visibility from 'visibilityjs'
import Vue from 'vue'
import BN from 'bignumber.js'

export default Vue.extend({
  name: 'TablesLatestBlocks',
  props: {
    showHeader: {
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
      uncles: [],
      showUncles: {},
      footnote: [
        {
          color: 'success',
          text: this.$i18n.t('footnote.success'),
          icon: 'fa fa-circle'
        },
        {
          color: 'warning',
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
    },
    getNumber(raw: string) {
      return new BN(raw).toNumber()
    }
  },
  created() {
    this.uncles = this.$store.getters.getUncles
    this.$eventHub.$on(sEvents.newUncle, _uncle => {
      if (Visibility.state() === 'visible') {
        this.uncles = this.$store.getters.getUncles
      }
    })
  },
  beforeDestroy() {
    this.$eventHub.$off(sEvents.newUncle)
  },
  computed: {
    getUncles() {
      return this.uncles.slice(0, this.maxItems)
    },
    getStyle() {
      return this.showStyle
    }
  }
})
</script>
