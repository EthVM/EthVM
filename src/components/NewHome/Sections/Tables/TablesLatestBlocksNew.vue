<template>

   <div class="latest-blocks" :class="frompage">
      <p class="block-title">Latest Blocks</p>

      <div class="data-container">
         <div class="data-block" v-for="block in getBlocks" v-if="!block.getIsUncle()">
            <div class="absolute-top-right-block">
               <div>
                  <p><span>{{block.getNumber().toNumber()}}</span>Block / <span>{{block.getTransactionCount()}}</span>TXs / <span>{{block.getTotalBlockReward().toEth()}}</span>Reward</p>   
               </div>
               <div>
                  <p class="tx-status" v-if="block.getUncleHashes().length != 0">{{block.getUncleHashes().length}}&nbsp;uncles<span>OPEN</span></p>
               </div>               
            </div>
            <div class="relative-block">
               <div class="hash-block">
                  <p>HASH#&nbsp;&nbsp;<router-link :to="'/block/'+block.getHash().toString()">{{block.getHash().toString()}}</router-link></p>
                  <p>MINER#&nbsp;<router-link :to="'/block/'+block.getHash().toString()">{{block.getMiner().toString()}}</router-link></p>
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
