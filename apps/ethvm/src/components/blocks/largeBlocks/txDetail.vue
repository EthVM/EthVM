<template>
  <div class="details" v-if="tx">
    <!-- Header -->
    <div class="block-title-container">
      <h3 class="block-title">{{ $t( 'title.overview' ) }}</h3>
      <!-- End Header -->
    </div>
    <div class="detail-container">
      <!-- Tx Info -->
      <div class="detail-row-copy">
        <li>{{ $t( 'common.hash' ) }}</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getHash()"></copy-to-clip-component>
        </div>
        <li>{{tx.getHash()}}</li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'common.status' ) }}</li>
        <li>{{getStringStatus(tx.getStatus())}}</li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'common.timestmp' ) }}</li>
        <li>{{tx.getTimestamp().toDate().toString()}} (
          <timeago :since="tx.getTimestamp().toDate()" :auto-update="10"></timeago>)</li>
      </div>
      <div class="detail-row-copy">
        <li>{{ $t( 'tx.from' ) }}</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getFrom().toString()"></copy-to-clip-component>
        </div>
        <li class="address-link">
          <router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}}</router-link>
        </li>
      </div>
      <div v-if="tx.getContractAddress().toString()" class="detail-row-copy">
        <li>{{ $t( 'tx.contract' ) }}</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getContractAddress().toString()"></copy-to-clip-component>
        </div>
        <li class="link">
          <router-link :to="'/address/'+tx.getContractAddress().toString()">{{tx.getContractAddress().toString()}}</router-link>
        </li>
      </div>
      <div v-else class="detail-row-copy">
        <li>{{ $t( 'tx.to' ) }}</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getTo().toString()"></copy-to-clip-component>
        </div>
        <li class="link">
          <router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link>
        </li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'tx.amount' ) }}</li>
        <li>{{tx.getValue().toEth().toString()}}&nbsp;ETH</li>
      </div>
      <div class="detail-row-copy">
        <li>{{ $t( 'tableHeader.blockN' ) }}</li>
        <div class="copy">
          <copy-to-clip-component :valueToCopy="tx.getBlockNumber()"></copy-to-clip-component>
        </div>
        <li class="link">
          <router-link :to="'/block/'+tx.getBlockHash().toString()">{{tx.getBlockNumber()}}</router-link>
        </li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'gas.limit' ) }}</li>
        <li>{{tx.getGas().toNumber()}}</li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'gas.used' ) }}</li>
        <li>{{tx.getGasUsed().toNumber()}}</li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'gas.price' ) }}</li>
        <li>{{tx.getGasPrice().toGWei()}}</li>
      </div>
      <div class="detail-row">
        <li>{{ $t( 'tx.cost' ) }}</li>
        <li>{{getTxCost(tx.getGasPrice().toEth(), tx.getGasUsed().toNumber())}} &nbsp;{{ $t( 'common.eth' ) }}</li>
      </div>
      <!--End Tx Info -->
    </div>
    <!-- End details -->
  </div>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import store from '@app/states'
import Vue from 'vue'

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
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/detailComponent.less';
</style>
