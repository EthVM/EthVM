<template>
<div id="TablesLatestBlocks"
     class="latest-blocks">
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
              <p><a :href="'/block/'+block.getHash().toString()">{{block.getHash().toString()}}</a></p>
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
                <div v-show="block.getUncleHashes().length"
                     @click="showUncles[block.getHash().toString()]=!showUncles[block.getHash().toString()]">
                  <icon :name="!showUncles[block.getHash().toString()] ? 'plus-square-o' : 'minus-square-o'"
                        scale='1'></icon>
                </div>&nbsp;{{block.getUncleHashes().length}}&nbsp;Uncles</p>
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
            <td>
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
                 <td class="sub-height">
                  <p>Hash:&nbsp;<span><a :href="'/block/'+block.getHash().toString()">{{uncle.getHash().toString()}}</a></span></p>
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
import { FIFO, Block, processBlocks } from '@/libs'
import globConfigs from '@/configs/global.json'
import sEvents from '@/configs/socketEvents.json'
export default Vue.extend({
  name: 'TablesLatestBlocks',
  props: {
    maxItems: Number
  },
  data () {
    return {
      blocks: new FIFO < Block >(globConfigs.maxTxsInMemory, processBlocks),
      showUncles: {}
    }
  },
  beforeMount () {
    let parent = this
    this.$socket.emit(sEvents.pastBlocks, '', (_blocks) => {
      _blocks.forEach((_block) => {
        let tempBlock = new Block(_block)
        parent.$set(parent.showUncles, tempBlock.getHash().toString(), false)
        parent.blocks.add(tempBlock)
      })
    })
  },
  created () {
    let parent = this
    parent.$eventHub.$on(sEvents.newBlock, (_block) => {
      parent.$set(parent.showUncles, _block.getHash().toString(), false)
      parent.blocks.add(_block)
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.newBlock)
  },
  computed: {
    getBlocks () {
      return this.blocks.items().slice(0, this.maxItems)
    }
  },
  methods: {
  }
})
</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Sections/Tables/TablesLatestBlocks.less";
</style>
