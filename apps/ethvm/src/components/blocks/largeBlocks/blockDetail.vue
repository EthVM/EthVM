<template>
  <div id="details">
    <div class="details" v-if="block">
      <!-- Header -->
      <div class="block-title-container">
        <h3 v-show="!isUncle" class="block-title">{{ $t( 'title.overview' ) }}</h3>
        <h3 v-show="isUncle" class="block-title">{{ $t( 'block.uncle' ) }} {{ $t( 'title.overview' ) }}</h3>
        <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === false">{{ $t( 'bttn.more' ) }}</button>
        <button class="button-common" v-on:click="showMore = !showMore" v-if="showMore === true">{{ $t( 'bttn.less' ) }}</button>
        <!-- End Header -->
      </div>
      <!-- Block Details -->
      <div class="detail-container">
        <!-- Main Info -->
        <div class="detail-row">
          <li>{{ $t( 'block.height' ) }}</li>
          <li>{{block.getNumber().toNumber()}}</li>
        </div>
        <div class="detail-row-copy">
          <li>{{ $t( 'common.hash' ) }}</li>
          <div class="copy">
            <copy-to-clip-component :valueToCopy="block.getHash().toString()"></copy-to-clip-component>
          </div>
          <li>{{block.getHash().toString()}}</li>
        </div>
        <div class="detail-row-copy">
          <li>{{ $t( 'block.miner' ) }}</li>
          <div class="copy">
            <copy-to-clip-component :valueToCopy="block.getMiner().toString()"></copy-to-clip-component>
          </div>
          <li>
            <router-link :to="'/address/'+block.getMiner().toString()">{{block.getMiner().toString()}}</router-link>
          </li>
        </div>
        <div class="detail-row">
          <li>{{ $t( 'block.reward' ) }}</li>
          <li>{{block.getBlockReward().toEth()}}&nbsp;{{ $t( 'common.eth' ) }}</li>
        </div>
        <div class="detail-row" v-if="!isUncle">
          <li>{{ $t( 'block.totalReward' ) }}</li>
          <li>{{block.getTotalBlockReward().toEth()}}&nbsp;{{ $t( 'common.eth' ) }}</li>
        </div>
        <div class="detail-row" v-if="!isUncle">
          <li>{{ $t( 'block.fees' ) }}</li>
          <li>{{block.getTxFees().toEth()}}&nbsp;{{ $t( 'common.eth' ) }}</li>
        </div>
        <div class="detail-row">
          <li>{{ $t( 'common.timestmp' ) }}</li>
          <li>{{block.getTimestamp().toDate().toString()}} (
            <timeago :since="block.getTimestamp().toDate()" :auto-update="10"></timeago>)</li>
        </div>
        <div class="detail-row-copy">
          <li>{{ $t( 'block.pHash' ) }}</li>
          <div class="copy">
            <copy-to-clip-component :valueToCopy="block.getParentHash().toString()"></copy-to-clip-component>
          </div>
          <li>
            <router-link :to="'/block/'+block.getParentHash().toString()">{{block.getParentHash().toString()}}</router-link>
          </li>
        </div>
        <div class="detail-row">
          <li>{{ $t( 'block.size' ) }}</li>
          <li>{{block.getSize().toNumber()}}</li>
        </div>
        <div class="detail-row" v-if="!isUncle">
          <li>{{ $t( 'title.tx' ) }}</li>
          <li>{{block.getTransactionCount()}}</li>
        </div>
        <!-- End Main Info -->
        <!-- Show More Details -->
        <transition name="fade">
          <div class="detail-more" v-if="showMore">
            <div class="detail-row" v-if="!isUncle">
              <li>{{ $t( 'gas.limit' ) }}</li>
              <li>{{block.getGasLimit().toNumber()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>{{ $t( 'gas.used' ) }}</li>
              <li>{{block.getGasUsed().toNumber()}}</li>
            </div>
            <div class="detail-row">
              <li>{{ $t( 'block.diff' ) }}</li>
              <li>{{block.getDifficulty().toNumber()}}</li>
            </div>
            <div class="detail-row">
              <li>{{ $t( 'block.totalDiff' ) }}</li>
              <li>{{block.getTotalDifficulty().toNumber()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>{{ $t( 'block.logs' ) }}</li>
              <li>{{block.getLogsBloom().toString()}}</li>
            </div>
            <div class="detail-row">
              <li>{{ $t( 'block.nonce' ) }}</li>
              <li>{{block.getNonce().toString()}}</li>
            </div>
            <div class="detail-row">
              <li>{{ $t( 'block.root' ) }}</li>
              <li>{{block.getStateRoot().toString()}}</li>
            </div>
            <div class="detail-row">
              <li>{{ $t( 'block.data' ) }}</li>
              <li>{{block.getExtraData().toString()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>{{ $t( 'block.txRoot' ) }}</li>
              <li>{{block.getTransactionsRoot().toString()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>{{ $t( 'block.recRoot' ) }}</li>
              <li>{{block.getReceiptsRoot().toString()}}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>{{ $t( 'block.uncle', 1 ) }} {{ $t( 'block.uncReward' ) }}</li>
              <li>{{block.getUncleReward().toEth()}}&nbsp;{{ $t( 'common.eth' ) }}</li>
            </div>
            <div class="detail-row" v-if="!isUncle">
              <li>{{ $t( 'block.uncle', 2 ) }} {{ $t( 'block.sha' ) }}</li>
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
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import store from '@app/states'
import Vue from 'vue'

export default Vue.extend({
  name: 'BlockView',
  props: ['block', 'uncles'],
  data() {
    return {
      showMore: false
    }
  },
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
