<template>
  <div id="latest-blocks">
    <!-- Table Header -->
    <div v-if="showHeader" class="block-table-header">
      <li>Block #</li>
      <li></li>
      <li>Txs</li>
      <li>Reward</li>
      <!-- End Table Header -->
    </div>
    <div class="block-body">
      <!-- Table Row -->
      <div class="block" v-for="block in getBlocks" v-if="!block.getIsUncle()">
        <!-- Block Info -->
        <div class="block-data">
          <!-- Col1: Block Number -->
          <li>
            <p class="block-number"><span>{{block.getNumber().toNumber()}}</span></p>
            <!-- End Col1 -->
          </li>
          <!-- Col2: Block Hash and Miner -->
          <li class="hash">
            <div>
              <p>Hash</p>
              <p>
                <router-link :to="'/block/'+block.getHash().toString()">{{block.getHash().toString()}}</router-link>
              </p>
            </div>
            <div>
              <p>Miner</p>
              <p>
                <router-link :to="'/address/'+block.getMiner().toString()">{{block.getMiner().toString()}}</router-link>
              </p>
            </div>
            <!-- End Col2-->
          </li>
          <!-- Col3: Transactions Info -->
          <li class="txs">
            <div class="success">
              {{block.getTransactionCount()}}
            </div>
            <div class="failed">
              5
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
          <div class="uncles-title">Uncles:</div>
          <!-- SUB LOOP START-->
          <div class="uncles-data" v-for="uncle in block.getUncles()">
            <li class="sub-hash">
              <p>Hash</p>
              <p>
                <router-link :to="'/block/'+uncle.getHash().toString()">{{uncle.getHash().toString()}}</router-link>
              </p>
            </li>
            <li class="sub-miner">
              <p>Miner</p>
              <p>
                <router-link :to="'/address/'+uncle.getMiner().toString()">{{uncle.getMiner().toString()}}</router-link>
              </p>
            </li>
            <li class="sub-height">
              <p>Height</p>
              <p>{{uncle.getNumber().toNumber()}}</p>
            </li>
            <li class="sub-reward">
              <p>Reward(ETH)</p>
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
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import Visibility from 'visibilityjs'

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
      let length = newRewardValue.length
      let isShort = false
      if (length > 8) {
        newRewardValue = newRewardValue.slice(0, 8) + '...'
        isShort = true
      }
      if (!isBool) return newRewardValue
      else return isShort
    }
  },
  created() {
    let parent = this
    parent.blocks = parent.$store.getters.getBlocks
    parent.$eventHub.$on(sEvents.newBlock, _block => {
      if (Visibility.state() === 'visible') {
        parent.blocks = parent.$store.getters.getBlocks
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
