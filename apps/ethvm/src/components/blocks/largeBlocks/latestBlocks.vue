<template>
  <div id="latest-blocks">
    <!-- Table Header -->
    <div v-if="showHeader" class="block-table-header">
      <li>{{ $t( 'tableHeader.blockN' ) }}</li>
      <li></li>
      <li>{{ $t( 'tableHeader.txs' ) }}</li>
      <li>{{ $t( 'tableHeader.reward' ) }}</li>
      <!-- End Table Header -->
    </div>
    <div class="block-body">
      <!-- Table Row -->
      <div class="block" v-for="block in getBlocks" v-if="!block.getIsUncle()" v-bind:key="block.hash">
        <!-- Block Info -->
        <div class="block-data">
          <!-- Col1: Block Number -->
          <li>
            <p class="block-number"><router-link :to="'/block/'+block.getHash()">{{block.getNumber()}}</router-link></p>
            <!-- End Col1 -->
          </li>
          <!-- Col2: Block Hash and Miner -->
          <li class="hash">
            <div>
              <p>{{ $t( 'common.hash' ) }}</p>
              <p>
                <router-link :to="'/block/'+block.getHash()">{{block.getHash()}}</router-link>
              </p>
            </div>
            <div>
              <p>{{ $t( 'block.miner' ) }}</p>
              <p>
                <router-link :to="'/address/'+block.getMiner().toString()">{{block.getMiner().toString()}}</router-link>
              </p>
            </div>
            <!-- End Col2-->
          </li>
          <!-- Col3: Transactions Info -->
          <li class="txs">
            <div class="success">
              {{getNumber(block.getStats().success)}}
            </div>
            <div class="failed">
              {{getNumber(block.getStats().failed)}}
            </div>
            <!-- End Col3 -->
          </li>
          <!-- Col4: Block Reward -->
          <li>
            <div class="reward">
              <div class="">{{getShortRewardValue(block.getTotalBlockReward().toEth().toString(), false)}}</div>
              <div class="tooltip-button" v-tooltip="block.getTotalBlockReward().toEth()" v-if="getShortRewardValue(block.getTotalBlockReward().toEth().toString(), true)"><i class="fa fa-question-circle-o" aria-hidden="true"></i></div>
            </div>
            <!-- End Col4 -->
          </li>
          <!-- End Block Data -->
        </div>
        <!-- If Block has Uncles -->
        <div class="uncles-block" v-if="block.getUncles()">
          <div class="uncles-line"></div>
          <div class="uncles-title">{{ $t( 'block.uncle', 1 ) }}:</div>
          <!-- SUB LOOP START-->
          <div class="uncles-data" v-for="uncle in block.getUncles()" v-bind:key="uncle.hash">
            <li class="sub-hash">
              <p>{{ $t( 'common.hash') }}</p>
              <p>
                <router-link :to="'/block/'+uncle.getHash()">{{uncle.getHash()}}</router-link>
              </p>
            </li>
            <li class="sub-miner">
              <p>{{ $t( 'block.miner' ) }}</p>
              <p>
                <router-link :to="'/address/'+uncle.getMiner().toString()">{{uncle.getMiner().toString()}}</router-link>
              </p>
            </li>
            <li class="sub-height">
              <p>{{ $t( 'block.height' ) }}</p>
              <p>{{uncle.getNumber()}}</p>
            </li>
            <li class="sub-reward">
              <p>{{ $t( 'block.reward' ) }}</p>
              <p>{{uncle.getTotalBlockReward().toEth()}}</p>
            </li>
            <!-- SUB LOOP END -->
          </div>
          <!-- End If Block has Uncles -->
        </div>
        <!-- End Table Row -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import sEvents from '@app/configs/socketEvents.json'
import Visibility from 'visibilityjs'
import Vue from 'vue'
import BN from 'bignumber.js'

export default Vue.extend({
  name: 'TablesLatestBlocks',
  props: {
    showHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      blocks: [],
      showUncles: {}
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
    this.blocks = this.$store.getters.getBlocks
    this.$eventHub.$on(sEvents.newBlock, _block => {
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
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/blocksTable.less';
</style>
