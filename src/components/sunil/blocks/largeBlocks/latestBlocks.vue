<template>
  <div id="latest-blocks">

    <div class="block-header hidden">
      <li>Block#</li>
      <li></li>
      <li>TXs</li>
      <li>Reward</li>
    </div>


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


        <div class="uncles-block" v-if="block.getUncleHashes().length != 0">
         
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




    <div class="data-container block-body hidden">
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
            <li><p>BLOCK#&nbsp;<span>{{block.getNumber().toNumber()}}</span></p></li>
            <li><h4 class="hash">HASH&nbsp;&nbsp;&nbsp;&nbsp;<router-link :to="'/block/'+block.getHash().toString()">{{block.getHash().toString()}}</router-link></h4></li>
            <li><h4 class="miner">MINER&nbsp;&nbsp;&nbsp;<router-link :to="'/address/'+block.getMiner().toString()">{{block.getMiner().toString()}}</router-link></h4></li>
            <li><h4 class="uncle-counter" v-if="block.getUncleHashes().length != 0">UNCLES&nbsp;&nbsp;<span>{{block.getUncleHashes().length}}</span>&nbsp;<span class="glyphicon glyphicon-chevron-down"></span></h4></li>
          </div>

          <div class="uncles-block" v-if="block.getUncleHashes().length != 0">
           
            <!-- SUB LOOP START ############## -->
            <div v-for="uncle in block.getUncles()">
            
              <li class="sub-hash">
                <p>HASH&nbsp;<span><router-link :to="'/block/'+uncle.getHash().toString()">{{uncle.getHash().toString()}}</router-link></span></p>
              </li>

              <li class="sub-height">
                <p>HEIGHT&nbsp;<span>{{uncle.getNumber().toNumber()}}</span></p>
              </li>

              <li class="sub-miner">
                <p>MINER&nbsp;<span><router-link :to="'/address/'+uncle.getMiner().toString()">{{uncle.getMiner().toString()}}</router-link></span></p>
              </li>

              <li class="sub-reward">
                <p>REWARD(ETH)&nbsp;<span>{{uncle.getTotalBlockReward().toEth()}}</span></p>
              </li>
              
            </div>
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
