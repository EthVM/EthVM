<template>
<div class="standard-table-3">
  <p class="table-title">
    <icon name='refresh'
          scale='1'></icon> Latest Blocks</p>
  <div class="data-block-loop"
       v-for="block in getBlocks"
       v-if="!block.getIsUncle()">
    <!-- .data-block-1 111111111111111111111111111111111111111111111111 -->
    <div class="data-block-1">
      <div class="hash-block">Hash <span><a :href="'/block/'+block.getHash().toString()">{{block.getHash().toString()}}</a></span></div>
    </div>
    <!-- .data-block-1 111111111111111111111111111111111111111111111111 -->
    <!-- .data-block-2 222222222222222222222222222222222222222222222222 -->
    <div class="data-block-2">
      <div class="each-block">
        <h1>Height</h1>
        <p>{{block.getNumber().toNumber()}}</p>
      </div>
      <div class="each-block">
        <h1>TXs</h1>
        <p>{{block.getTransactionCount()}}</p>
      </div>
      <div class="each-block">
        <h1>Reward<span></span></h1>
        <p>{{block.getTotalBlockReward().toEth()}}&nbsp;ETH</p>
      </div>
      <div class="each-block">
        <h1>Miner</h1>
        <p>{{block.getMiner().toString()}}</p>
      </div>
    </div>
    <!-- .data-block-2 222222222222222222222222222222222222222222222222 -->
    <!-- .data-block-sub 3333333333333333333333333333333333333333333333 -->
    <div class="data-block-sub">
      <div class="loop-point"
           v-for="uncle in block.getUncles()">
        <div class="sub-icon">
          <icon name='code-fork'
                scale='1'></icon>
        </div>
        <div class="sub-data">
          <div class="sub-hash-block">
            <h1>Hash</h1>
            <p><a :href="'/block/'+uncle.getHash().toString()">{{uncle.getHash().toString()}}</a></p>
          </div>
          <div class="sub-data-block-container">
            <div class="sub-data-block">
              <h1>Height</h1>
              <p>{{uncle.getNumber().toNumber()}}</p>
            </div>
            <div class="sub-data-block">
              <h1>Reward</h1>
              <p>{{uncle.getTotalBlockReward().toEth()}}&nbsp;ETH</p>
            </div>
            <div class="sub-data-block">
              <h1>Miner</h1>
              <p>{{uncle.getMiner().toString()}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- .data-block-sub 3333333333333333333333333333333333333333333333 -->
  </div>
  <!-- .data-block-loop -->
</div>
<!-- .standard-table-1 -->

</template>

<script lang="ts">
import Vue from 'vue'
import { FIFO, Block, processBlocks } from '@/libs'
import globConfigs from '@/configs/global.json'
import sEvents from '@/configs/socketEvents.json'
export default Vue.extend({
  name: 'block-container',
  props: {
    maxItems: Number
  },
  data () {
    return {
      blocks: new FIFO() < Block > (globConfigs.maxTxsInMemory, processBlocks)
    }
  },
  beforeMount () {
    let _this = this
    this.$socket.emit(sEvents.pastBlocks, '', (_blocks) => {
      _blocks.forEach((_block) => {
        _this.blocks.add(new Block(_block))
      })
    })
  },
  created () {
    let _this = this
    _this.$eventHub.$on(sEvents.newBlock, (_block) => {
      _this.blocks.add(_block)
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.newBlock)
  },
  computed: {
    getBlocks () {
      return this.blocks.items().slice(0, this.maxItems)
    }
  }
})
</script>

<style scoped="" lang="less">
@import '~lessPath/standardTables';
</style>
