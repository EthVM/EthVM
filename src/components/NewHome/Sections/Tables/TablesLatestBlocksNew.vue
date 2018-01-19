<template>

   <div class="latest-blocks" :class="frompage">
      <p class="block-title2">Latest Blocks</p>
      <p class="block-title3">Latest blocks mined by miners</p>

      <div class="data-container">
         <div class="data-block" v-for="block in getBlocks" v-if="!block.getIsUncle()">
            <div class="absolute-top-right-block">
               <div>
                  <p class="other-info">TXs <span>{{block.getTransactionCount()}}</span>&nbsp;/&nbsp;Reward(ETH) <span>{{block.getTotalBlockReward().toEth()}}</span></p>
               </div>
               <div class="hidden">
                  <p class="block-number">BLOCK#&nbsp;<span>{{block.getNumber().toNumber()}}</span></p>
               </div>
               <div class="hidden">
                  <p class="uncle-number" v-if="block.getUncleHashes().length != 0">uncles&nbsp;<span>{{block.getUncleHashes().length}}</span></p>
               </div>
            </div>
            <div class="relative-block">
               <div class="hash-block">
                  <p>BLOCK#&nbsp;<span>{{block.getNumber().toNumber()}}</span></p>
                  <h4 class="hash">HASH&nbsp;&nbsp;&nbsp;&nbsp;<router-link :to="'/block/'+block.getHash().toString()">{{block.getHash().toString()}}</router-link></h4>
                  <h4 class="miner">MINER&nbsp;&nbsp;&nbsp;{{block.getMiner().toString()}}</h4>
                  <h4 class="uncle-counter" v-if="block.getUncleHashes().length != 0">UNCLES&nbsp;&nbsp;<span>{{block.getUncleHashes().length}}</span>&nbsp;<span class="glyphicon glyphicon-chevron-down"></span></h4>
               </div>

               
               
               <div class="uncles-block" v-if="block.getUncleHashes().length != 0">
                  


                  <!-- SUB LOOP START ############## -->
                     
                    
                      <table>
                        <tbody>
                          <tr v-for="uncle in block.getUncles()">
                             <td class="sub-hash">
                              <p>HASH&nbsp;<span><router-link :to="'/block/'+uncle.getHash().toString()">{{uncle.getHash().toString()}}</router-link></span></p>
                            </td>
                            <td class="divider">|</td>
                            <td class="sub-height">
                              <p>HEIGHT&nbsp;<span>{{uncle.getNumber().toNumber()}}</span></p>
                            </td>
                            <td class="divider">|</td>
                            <td class="sub-miner">
                              <p>MINER&nbsp;<span>{{uncle.getMiner().toString()}}</span></p>
                            </td>
                            <td class="divider">|</td>
                            <td class="sub-reward">
                              <p>REWARD(ETH)&nbsp;<span>{{uncle.getTotalBlockReward().toEth()}}</span></p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    
                  
                  <!-- SUB LOOP END ############## -->


               </div>

            </div>            
         </div><!-- .data-block -->
      </div><!-- .data-container -->
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
@import "~lessPath/NewHome/Sections/Tables/TablesLatestBlocksNew.less";
</style>
