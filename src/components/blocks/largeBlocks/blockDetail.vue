<template>
  <div class="block-detail">
    <div class="block-detail-container" v-if="block">
      <p v-show="!isUncle" class="block-title">Overview</p>
      <p v-show="isUncle" class="block-title">Overview (Uncle)</p>
      <button class="top-right-button-common" v-on:click="showMore = !showMore" v-if="showMore === false">More</button>
      <button class="top-right-button-common" v-on:click="showMore = !showMore" v-if="showMore === true">Less</button>

      <div class="details" v-bind:class="{ 'show-more-info': showMore }">

        <div>
          <li>Height</li>
          <li>{{block.getNumber().toNumber()}}</li>
        </div>
        <div>
          <li>Timestamp</li>
          <li>{{block.getTimestamp().toDate().toString()}} (<timeago :since="block.getTimestamp().toDate()" :auto-update="10"></timeago>)</li>
        </div>

        <div v-show="!isUncle">
          <li>Transactions</li>
          <li>{{block.getTransactionCount()}}</li>
        </div>

        <div>
          <li>Hash</li>
          <li>{{block.getHash().toString()}}</li>
        </div>
        <div>
          <li>Miner</li>
          <li><router-link :to="'/address/'+block.getMiner().toString()">{{block.getMiner().toString()}}</router-link></li>
        </div>
        
        <div>
          <li>Block Reward</li>
          <li>{{block.getBlockReward().toEth()}}&nbsp;ETH</li>
        </div>

        <div v-show="!isUncle">
          <li>Logs</li>
          <li>{{block.getLogsBloom().toString()}}</li>
        </div>

        <div>
          <li>Parent Hash</li>
          <li><router-link :to="'/block/'+block.getParentHash().toString()">{{block.getParentHash().toString()}}</router-link></li>
        </div>

        <div>
          <li>Nonce</li>
          <li>{{block.getNonce().toString()}}</li>
        </div>
        <div>
          <li>State Root</li>
          <li>{{block.getStateRoot().toString()}}</li>
        </div>
        <div>
          <li>Extra Data</li>
          <li>{{block.getExtraData().toString()}}</li>
        </div>
        <div>
          <li>Size</li>
          <li>{{block.getSize().toNumber()}}</li>
        </div>
        <div v-show="!isUncle">
          <li>Gas Limit</li>
          <li>{{block.getGasLimit().toNumber()}}</li>
        </div>
        <div v-show="!isUncle">
          <li>Gas Used</li>
          <li>{{block.getGasUsed().toNumber()}}</li>
        </div>
        <div v-show="!isUncle">
          <li>Transactions Root</li>
          <li>{{block.getTransactionsRoot().toString()}}</li>
        </div>
        <div v-show="!isUncle">
          <li>Receipts Root</li>
          <li>{{block.getReceiptsRoot().toString()}}</li>
        </div>
        <div v-show="!isUncle">
          <li>TX Fees</li>
          <li>{{block.getTxFees().toEth()}}&nbsp;ETH</li>
        </div>

        <div v-show="!isUncle">
          <li>Uncle Reward</li>
          <li>{{block.getUncleReward().toEth()}}&nbsp;ETH</li>
        </div>
        <div>
          <li>Total BlockReward</li>
          <li>{{block.getTotalBlockReward().toEth()}}&nbsp;ETH</li>
        </div>
        <div v-show="!isUncle">
          <li>SHA3 Uncles</li>
          <li>{{block.getSha3Uncles().toString()}}</li>
        </div>
        <div>
          <li>Difficulty</li>
          <li>{{block.getDifficulty().toNumber()}}</li>
        </div>
        <div>
          <li>Total Difficulty</li>
          <li>{{block.getTotalDifficulty().toNumber()}}</li>
        </div>
      
      </div><!-- .details -->
    </div><!-- .block-detail-container -->



    <div class="uncles-container" v-if="uncles.length > 0">
      
      <div class="uncles-detail" v-for="uncle in uncles">
        <p class="block-title">Uncle</p>
        <div class="details">
          <div>
            <li>Height</li>
            <li>{{uncle.getNumber().toNumber()}}</li>
          </div>
          <div>
            <li>Hash</li>
            <li><a v-bind:href="'/block/' + uncle.getHash().toString()">{{uncle.getHash().toString()}}</a></li>
          </div>
          <div>
            <li>Block Reward</li>
            <li>{{uncle.getBlockReward().toEth()}}&nbsp;ETH</li>
          </div>
        </div><!-- .details -->
      </div><!-- .block-title -->
    </div><!-- .uncles-container -->

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/states';
import chartOptions from '@/sampleData/chartData.json';
import { Block, common, Tx } from '@/libs';
export default Vue.extend({
  name: 'BlockView',
  props: [
    'block',
    'uncles'
  ],
  data() {
    return {
        showMore: false
    }
  },
  methods: {},
  mounted: function() {

    //console.log(this.uncles)

  },
  computed: {
    isUncle(){
      return this.block.getIsUncle()
    }
  }
})

</script>

<style scoped="" lang="less">
  @import "~lessPath/sunil/blocks/largeBlocks/blockDetail.less";
</style>
