<template>
  <div id="details">
    <div class="details" v-if="block">
      <!-- Header -->
      <div class="block-title-container">
        <h3 v-show="!isUncle" class="block-title">Overview</h3>
        <h3 v-show="isUncle" class="block-title">Overview (Uncle)</h3>
        <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === false">More</button>
        <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === true">Less</button>
        <!-- End Header -->
      </div>
      <!-- Block Details -->
      <div class="detail-container">
        <!-- Main Info -->
        <div class="detail-row">
          <li>Height</li>
          <li>{{block.getNumber().toNumber()}}</li>
        </div>
        <div class="detail-row-copy">
          <li>Hash</li>
          <div class="copy"><copy-to-clip-component :valueToCopy="block.getHash().toString()"></copy-to-clip-component></div>
          <li>{{block.getHash().toString()}}</li>
        </div>
        <div class="detail-row-copy">
          <li>Miner</li>
          <div class="copy"><copy-to-clip-component :valueToCopy="block.getMiner().toString()"></copy-to-clip-component></div>
          <li><router-link :to="'/address/'+block.getMiner().toString()">{{block.getMiner().toString()}}</router-link></li>
        </div>
        <div class="detail-row">
          <li>Block Reward</li>
          <li>{{block.getBlockReward().toEth()}}&nbsp;ETH</li>
        </div>
        <div class="detail-row" v-if="!isUncle">
          <li>Total Block Reward</li>
          <li>{{block.getTotalBlockReward().toEth()}}&nbsp;ETH</li>
        </div>
        <div class="detail-row" v-if="!isUncle">
          <li>TX Fees</li>
          <li>{{block.getTxFees().toEth()}}&nbsp;ETH</li>
        </div>
        <div class="detail-row">
          <li>Timestamp</li>
          <li>{{block.getTimestamp().toDate().toString()}} (
            <timeago :since="block.getTimestamp().toDate()" :auto-update="10"></timeago>)</li>
        </div>
        <div class="detail-row-copy">
          <li>Parent Hash</li>
          <div class="copy"><copy-to-clip-component :valueToCopy="block.getParentHash().toString()"></copy-to-clip-component></div>
          <li><router-link :to="'/block/'+block.getParentHash().toString()">{{block.getParentHash().toString()}}</router-link></li>
        </div>
        <div class="detail-row">
          <li>Size</li>
          <li>{{block.getSize().toNumber()}}</li>
        </div>
        <div class="detail-row" v-if="!isUncle">
          <li>Transactions</li>
          <li>{{block.getTransactionCount()}}</li>
        </div>
        <!-- End Main Info -->
        <!-- Show More Details -->
        <transition name="fade">
          <div class="detail-more" v-if="showMore">
            <div class="detail-row" v-if="!isUncle">
              <li>Gas Limit</li>
              <li>{{block.getGasLimit().toNumber()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>Gas Used</li>
              <li>{{block.getGasUsed().toNumber()}}</li>
            </div>
            <div class="detail-row">
              <li>Difficulty</li>
              <li>{{block.getDifficulty().toNumber()}}</li>
            </div>
            <div class="detail-row">
              <li>Total Difficulty</li>
              <li>{{block.getTotalDifficulty().toNumber()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>TX Fees</li>
              <li>{{block.getTxFees().toEth()}}&nbsp;ETH</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>Logs</li>
              <li>{{block.getLogsBloom().toString()}}</li>
            </div>
            <div class="detail-row">
              <li>Nonce</li>
              <li>{{block.getNonce().toString()}}</li>
            </div>
            <div class="detail-row">
              <li>State Root</li>
              <li>{{block.getStateRoot().toString()}}</li>
            </div>
            <div class="detail-row">
              <li>Extra Data</li>
              <li>{{block.getExtraData().toString()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>Transactions Root</li>
              <li>{{block.getTransactionsRoot().toString()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>Receipts Root</li>
              <li>{{block.getReceiptsRoot().toString()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>Uncle Reward</li>
              <li>{{block.getUncleReward().toEth()}}&nbsp;ETH</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>SHA3 Uncles</li>
              <li>{{block.getSha3Uncles().toString()}}</li>
            </div>
            <!-- End Show More Details -->
          </div>
        </transition>
        <!-- End Block Details -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import { Block, common, Tx } from '@/libs'

export default Vue.extend({
  name: 'BlockView',
  props: ['block', 'uncles'],
  data() {
    return {
      showMore: false
    }
  },
  methods: {},
  mounted: function() {},
  computed: {
    isUncle() {
      return this.block.getIsUncle()
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
