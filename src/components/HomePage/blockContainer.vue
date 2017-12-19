<template>

  <div class="standard-table-3">
    <p class="table-title">
      <icon name='refresh'
            scale='1'></icon> Latest Blocks</p>
    
      <div class="data-block-loop" v-for="block in blocks" v-if="!block.getIsUncle()">
        


        <!-- .data-block-1 111111111111111111111111111111111111111111111111 -->
        <div class="data-block-1">
          <div class="hash-block">Hash <span><a :href="'/block/'+block.getHash()">{{block.getHash()}}</a></span></div>
        </div>
        <!-- .data-block-1 111111111111111111111111111111111111111111111111 -->
        



        <!-- .data-block-2 222222222222222222222222222222222222222222222222 -->
        <div class="data-block-2">
          <div class="each-block">
            <h1>Height</h1>
            <p>{{common.HexNumber(block.getNumber()).toNumber()}}</p>
          </div>
          
          <div class="each-block">
            <h1>TXs</h1>
            <p>{{block.getTransactionCount()}}</p>
          </div>

          <div class="each-block">
            <h1>Reward<span></span></h1>
            <p>{{common.EthValue(block.getTotalBlockReward()).toEth()}}&nbsp;ETH</p>
          </div>

          <div class="each-block">
            <h1>Miner</h1>
            <p>{{block.getMiner()}}</p>
          </div>
        </div>
        <!-- .data-block-2 222222222222222222222222222222222222222222222222 -->



        <!-- .data-block-sub 3333333333333333333333333333333333333333333333 -->
        <div class="data-block-sub">
          <div class="loop-point" v-for="uncle in block.getUncles()">

            <div class="sub-icon">
                <icon name='code-fork' scale='1'></icon>
            </div>

            <div class="sub-data">

              <div class="sub-hash-block">
                <h1>Hash</h1>
                <p>{{uncle.getHash()}}</p>
              </div>

              <div class="sub-data-block-container">
                <div class="sub-data-block">
                  <h1>Height</h1>
                  <p>{{uncle.getIntNumber()}}</p>
                </div>
                <div class="sub-data-block">
                  <h1>Reward</h1>
                  <p>{{common.EthValue(uncle.getTotalBlockReward()).toEth()}}&nbsp;ETH</p>
                </div>
                <div class="sub-data-block">
                  <h1>Miner</h1>
                  <p>{{uncle.getMiner()}}</p>
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
import store from '@/states'
import {common} from '@/libs'
export default Vue.extend({
  name: 'block-container',
  props: ['maxItems'],
  data () {
    return {
      store: store,
      common: common
    }
  },
  mounted: function () {

  },
  computed: {
    blocks () {
      return store.getters.getBlocks.slice(0, this.maxItems)
    }
  }
})
</script>

<style scoped lang='less'>
@import '~lessPath/standardTables';

</style>
