<template>
  <div id="latest-blocks">

    <div class="block-body">
      <div class="block" v-for="block in getBlocks" v-if="!block.getIsUncle()">
        <div class="block-data">
          <li>
            <p class="block-number"><span>{{block.getNumber().toNumber()}}</span></p>
          </li>
          <li class="hash">
            <div>
              <p>Hash</p>
              <p><router-link :to="'/block/'+block.getHash().toString()">{{block.getHash().toString()}}</router-link></p>
            </div>
            <div>
              <p>Miner</p>
              <p><router-link :to="'/address/'+block.getMiner().toString()">{{block.getMiner().toString()}}</router-link></p>
            </div>
          </li>
          <li class="txs">
            <div class="success">
              {{block.getTransactionCount()}}
            </div>
            <div class="failed">
              5
            </div>
          </li>
          <li>
            <div class="reward">
              {{block.getTotalBlockReward().toEth()}}
            </div>
          </li>

        </div><!--.block-data-->


        <div class="uncles-block" v-if="block.getUncles()">
         
          <div class="uncles-line"></div>

          <div class="uncles-title">Uncles</div>
          <!-- SUB LOOP START ############## -->
          <div class="uncles-data" v-for="uncle in block.getUncles()">
          
            <li class="sub-hash">
              <p>Hash</p>
              <p><router-link :to="'/block/'+uncle.getHash().toString()">{{uncle.getHash().toString()}}</router-link></p>
            </li>

            <li class="sub-miner">
              <p>Miner</p>
              <p><router-link :to="'/address/'+uncle.getMiner().toString()">{{uncle.getMiner().toString()}}</router-link></p>
            </li>

            <li class="sub-height">
              <p>Height</p>
              <p>{{uncle.getNumber().toNumber()}}</p>
            </li>

            <li class="sub-reward">
              <p>Reward(ETH)</p>
              <p>{{uncle.getTotalBlockReward().toEth()}}</p>
            </li>
            
          </div>
          <!-- SUB LOOP END ############## -->

        </div>
        
      </div><!--.block-->
      
    </div>



  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import sEvents from '@/configs/socketEvents.json'
  import Visibility from 'visibilityjs'
  export default Vue.extend({
    name: 'TablesLatestBlocks',
    props: [],
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
  @import "~lessPath/sunil/blocks/largeBlocks/latestBlocks.less";
</style>


