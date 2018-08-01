<template>
  <div class="details" v-if="tx">
    <!-- Header -->
    <div class="block-title-container">
      <h3 class="block-title">Overview</h3>
      <!-- End Header -->
    </div>
    <div class="detail-container">
      <!-- Tx Info -->
      <div class="detail-row-copy">
        <li>Hash</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getHash().toString()"></copy-to-clip-component>
        </div>
        <li>{{tx.getHash().toString()}}</li>
      </div>
      <div class="detail-row">
        <li>Status</li>
        <li>{{getStringStatus(tx.getStatus())}}</li>
      </div>
      <div class="detail-row">
        <li>Time Stamp</li>
        <li>{{tx.getTimestamp().toDate().toString()}} (
          <timeago :since="tx.getTimestamp().toDate()" :auto-update="10"></timeago>)</li>
      </div>
      <div class="detail-row-copy">
        <li>From</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getFrom().toString()"></copy-to-clip-component>
        </div>
        <li class="address-link">
          <router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}}</router-link>
        </li>
      </div>
      <div v-if="tx.getContractAddress().toString()" class="detail-row-copy">
        <li>Contract</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getContractAddress().toString()"></copy-to-clip-component>
        </div>
        <li class="link">
          <router-link :to="'/address/'+tx.getContractAddress().toString()">{{tx.getContractAddress().toString()}}</router-link>
        </li>
      </div>
      <div v-else class="detail-row-copy">
        <li>To</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getTo().toString()"></copy-to-clip-component>
        </div>
        <li class="link">
          <router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link>
        </li>
      </div>
      <div class="detail-row">
        <li>Amount</li>
        <li>{{tx.getValue().toEth().toString()}}&nbsp;ETH</li>
      </div>
      <div class="detail-row-copy">
        <li>Block</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getBlockNumber().toNumber()"></copy-to-clip-component>
        </div>
        <li class="link">
          <router-link :to="'/block/'+tx.getBlockHash().toString()">{{tx.getBlockNumber().toNumber()}}</router-link>
        </li>
      </div>
      <div class="detail-row">
        <li>Gas Limit</li>
        <li>{{tx.getGas().toNumber()}}</li>
      </div>
      <div class="detail-row">
        <li>Gas Used</li>
        <li>{{tx.getGasUsed().toNumber()}}</li>
      </div>
      <div class="detail-row">
        <li>Gas Price</li>
        <li>{{tx.getGasPrice().toGWei()}}</li>
      </div>
      <div class="detail-row">
        <li>Tx Cost</li>
        <li>{{getTxCost(tx.getGasPrice().toEth(), tx.getGasUsed().toNumber())}} &nbsp;ETH</li>
      </div>
      <!--End Tx Info -->
    </div>
    <!-- End details -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import { Block, common, Tx } from '@/libs'

export default Vue.extend({
  name: 'TxView',
  props: ['tx'],
  data() {
    return {}
  },
  methods: {
    getStringStatus(isBool) {
      if (isBool) {
        return 'Successful'
      }
      return 'Failed'
    },
    getTxCost(price, used) {
      return price * used
    }
  },
  mounted: function() {},
  computed: {}
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
