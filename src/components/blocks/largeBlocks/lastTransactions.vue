<template>
  <div class="last-transactions">
    <div class="block-body">
      <!-- Table Header -->
      <div class="tx-table-header" v-if="showHeader === true">
        <li>TXn#</li>
        <li class="eth">ETH</li>
        <li class="limit">Gas Limit</li>
        <li class="gas">GWEI</li>
        <li></li>
        <!-- End Table Header -->
      </div>
      <!-- Transactions Table -->
      <div class="block" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">
        <li>
          <!-- Tx Hash Number -->
          <div class="hash-block">
            <p class="hash">
              <router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</router-link>
            </p>
            <!-- End Tx Hash Number -->
          </div>
          <!-- Tx Addresses -->
          <div class="fromto">
            <p class="title">From</p>
            <p class="">
              <router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}}</router-link>
            </p>
            <p class="title" v-if="tx.getContractAddress().toString()">Contract</p>
            <p class="title" v-else>To</p>
            <p class="" v-if="tx.getContractAddress().toString()">
              <router-link :to="'/address/'+tx.getContractAddress().toString()">{{tx.getContractAddress().toString()}}</router-link>
            </p>
            <p class="" v-else>
              <router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link>
            </p>
            <!-- End Tx Addresses -->
          </div>
        </li>
        <!-- Tx Eth Value -->
        <li class="vertical-middle eth">
          <div class="">{{getShortEthValue(tx.getValue().toEth().toString(), false)}}</div>
          <div v-if="getShortEthValue(tx.getValue().toEth().toString(), true)" class="tooltip-button" v-tooltip="tx.getValue().toEth()"><i class="fa fa-question-circle-o" aria-hidden="true"></i></div>
          <!-- End Tx Eth Value -->
        </li>
        <li class="vertical-middle limit">
          <div>
            <p>{{tx.getGasUsed().toNumber()}}</p>
          </div>
        </li>
        <li class="vertical-middle gas">
          <div>
            <p>{{tx.getGasPrice().toGWei()}}</p>
          </div>
        </li>
        <!-- Tx Status -->
        <li class="vertical-middle status">
          <div v-if="!tx.getStatus()">
            <span class="glyphicon glyphicon-remove failed"></span>
          </div>
          <div v-else>
            <span class="glyphicon glyphicon-ok success"></span>
          </div>
          <!-- End Tx Status -->
        </li>
        <!-- End Transactions Table -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TableTransactions',
  props: ['transactions', 'showHeader'],
  created() {},
  methods: {
    /* Method to reduce Strig length : */
    getShortEthValue(newEthValue, isBool) {
      const length = newEthValue.length
      let isShort = false
      if (length > 6) {
        newEthValue = newEthValue.slice(0, 6) + '...'
        isShort = true
      }
      if (!isBool) {
        return newEthValue
      }
      return isShort
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/transactionsTable.less';
</style>
