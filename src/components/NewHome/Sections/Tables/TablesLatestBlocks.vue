<template>
<div id="TablesLatestBlocks"
     class="latest-blocks" :class="frompage">
  <p class="block-title">Latest Blocks</p>
  <div class="table-container">
    <table class="table-header">
      <thead>
        <tr>
          <td>Hash</td>
          <td>Miner</td>
        </tr>
      </thead>
    </table>
    <!-- MAIN LOOP START ########################################## -->
    <div class="table-content"
         v-for="block in getBlocks"
         v-if="!block.getIsUncle()">
      <table class="top-table-content">
        <tbody>
          <tr>
            <td class="top-hash">
              <p><router-link :to="'/block/'+block.getHash().toString()">{{block.getHash().toString()}}</router-link></p>
            </td>
            <td class="top-miner">
              <p>{{block.getMiner().toString()}}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="mid-table-content">
        <tbody>
          <tr>
            <td>
              <p>
                <span class="" v-show="block.getUncleHashes().length"
                     @click="showHideUncle(block.getHash().toString())">
                  <icon :name="!showUncles[block.getHash().toString()] ? 'plus-square-o' : 'minus-square-o'"
                        scale='1'></icon>
                </span>&nbsp;{{block.getUncleHashes().length}}&nbsp;Uncles</p>
            </td>
            <td>
              <p>
                <icon name='cubes'
                      scale='1'></icon>&nbsp;{{block.getNumber().toNumber()}}</p>
            </td>
            <td>
              <p>
                <icon name='exchange'
                      scale='1'></icon>&nbsp;{{block.getTransactionCount()}}</p>
            </td>
            <td class="block-reward">
              <p>
                <icon name='credit-card-alt'
                      scale='1'></icon>&nbsp;<span>{{block.getTotalBlockReward().toEth()}}</span>&nbsp;ETH</p>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- SUB LOOP START ############## -->
      <div v-if="showUncles[block.getHash().toString()]">
        <div class="sub-contents" v-for="uncle in block.getUncles()">
          <table>
            <tbody>
              <tr>
                 <td class="sub-hash">
                  <p>Hash:&nbsp;<span><router-link :to="'/block/'+block.getHash().toString()">{{uncle.getHash().toString()}}</router-link></span></p>
                </td>
                <td class="sub-height">
                  <p>Height:&nbsp;<span>{{uncle.getNumber().toNumber()}}</span></p>
                </td>
                <td class="sub-miner">
                  <p>Miner:&nbsp;<span>{{uncle.getMiner().toString()}}</span></p>
                </td>
                <td class="sub-reward">
                  <p>Reward:&nbsp;<span>{{uncle.getTotalBlockReward().toEth()}}</span></p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- SUB LOOP END ############## -->
    </div>
    <!-- MAIN LOOP END ########################################## -->
  </div>
</div>

</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import Visibility from 'visibilityjs'
export default Vue.extend({
  name: 'TablesLatestBlocks',
  props: ['frompage', 'maxItems'],
  data () {
    return {
      blocks: [],
      showUncles: {}
    }
  },
  methods: {
    showHideUncle (_hash:string) {
      this.$set(this.showUncles, _hash, !this.isUncleShown(_hash))
    },
    isUncleShown (_hash:string) {
      return this.showUncles[_hash] ? this.showUncles[_hash] : false
    }
  },
  beforeMount () {},
  created () {
    let parent = this
    parent.blocks = parent.$store.getters.getBlocks
    parent.$eventHub.$on(sEvents.newBlock, (_block) => {
      if (Visibility.state() === 'visible') {
        parent.blocks = parent.$store.getters.getBlocks
      }
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.newBlock)
  },
  computed: {
    getBlocks () {
      return this.blocks.slice(0, this.maxItems)
    }
  },
  mounted () {

  }
})
</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Sections/Tables/TablesLatestBlocks.less";
</style>
