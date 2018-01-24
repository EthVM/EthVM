<template>
  <div>
    <div class="block-detail-container" v-if="block">
      <p v-show="!isUncle" class="block-title">Block Detail Information</p>
      <p v-show="isUncle" class="block-title">Block Detail Information (Uncle)</p>

      <div class="details">
        <li>Height</li>
        <li>{{block.getNumber().toNumber()}}</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>Logs</li>
        <li>{{block.getLogsBloom().toString()}}</li>
      </div>
      <div class="details">
        <li>Timestamp</li>
        <li>{{block.getTimestamp().toDate().toString()}} (<timeago :since="block.getTimestamp().toDate()" :auto-update="10"></timeago>)</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>Transactions</li>
        <li>{{block.getTransactionCount()}}</li>
      </div>
      <div class="details">
        <li>Hash</li>
        <li>{{block.getHash().toString()}}</li>
      </div>
      <div class="details">
        <li>Parent Hash</li>
        <li><router-link :to="'/block/'+block.getParentHash().toString()">{{block.getParentHash().toString()}}</router-link></li>
      </div>
      <div class="details">
        <li>Miner</li>
        <li>{{block.getMiner().toString()}}</li>
      </div>
      <div class="details">
        <li>Nonce</li>
        <li>{{block.getNonce().toString()}}</li>
      </div>
      <div class="details">
        <li>State Root</li>
        <li>{{block.getStateRoot().toString()}}</li>
      </div>
      <div class="details">
        <li>Extra Data</li>
        <li>{{block.getExtraData().toString()}}</li>
      </div>
      <div class="details">
        <li>Size</li>
        <li>{{block.getSize().toNumber()}}</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>Gas Limit</li>
        <li>{{block.getGasLimit().toNumber()}}</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>Gas Used</li>
        <li>{{block.getGasUsed().toNumber()}}</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>Transactions Root</li>
        <li>{{block.getTransactionsRoot().toString()}}</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>Receipts Root</li>
        <li>{{block.getReceiptsRoot().toString()}}</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>TX Fees</li>
        <li>{{block.getTxFees().toEth()}}&nbsp;ETH</li>
      </div>
      <div class="details">
        <li>Block Reward</li>
        <li>{{block.getBlockReward().toEth()}}&nbsp;ETH</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>Uncle Reward</li>
        <li>{{block.getUncleReward().toEth()}}&nbsp;ETH</li>
      </div>
      <div class="details">
        <li>Total BlockReward</li>
        <li>{{block.getTotalBlockReward().toEth()}}&nbsp;ETH</li>
      </div>
      <div class="details" v-show="!isUncle">
        <li>SHA3 Uncles</li>
        <li>{{block.getSha3Uncles().toString()}}</li>
      </div>
      <div class="details">
        <li>Difficulty</li>
        <li>{{block.getDifficulty().toNumber()}}</li>
      </div>
      <div class="details">
        <li>Total Difficulty</li>
        <li>{{block.getTotalDifficulty().toNumber()}}</li>
      </div>
     
    </div><!-- .block-detail-container -->



    <div class="uncles-container">
      
      <div class="uncles-detail" v-for="uncle in uncles">
        <p class="block-title">Uncle</p>
        <div class="details">
          <li>Height</li>
          <li>{{uncle.getNumber().toNumber()}}</li>
        </div>
        <div class="details">
          <li>Hash</li>
          <li><a v-bind:href="'/block/' + uncle.getHash().toString()">{{uncle.getHash().toString()}}</a></li>
        </div>
        <div class="details">
          <li>Block Reward</li>
          <li>{{uncle.getBlockReward().toEth()}}&nbsp;ETH</li>
        </div>
      </div>
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
    return {}
  },
  methods: {},
  mounted: function() {},
  computed: {
    isUncle(){
      return this.block.getIsUncle()
    }
  }
})

</script>

<style scoped="" lang="less">
  @import "~lessPath/NewHome/Sections/SinglePages/SinglePagesBlock.less";
</style>
