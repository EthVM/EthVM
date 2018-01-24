<template>
<div class="last-transactions">
  <p class="block-title2">Transactions</p>
  <div class="data-container">
    <div class="data-block"
         v-for="tx in transactions"
         v-bind:key="tx.getHash().toString()">
      <div class="absolute-top-right-block">
        <div>
          <p>GAS <span>{{tx.getGasUsed().toNumber()}}</span> / WEI <span>{{tx.getGasPrice().toGWei()}}</span></p>
        </div>
        <div v-if="!tx.getStatus()">
          <p class="tx-status"><span class="glyphicon glyphicon-remove"></span> Unsuccessful</p>
        </div>
      </div>
      <div class="relative-block">
        <div class="tx-block">
          <li>
            <p>TX#&nbsp;<router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</router-link></p>
          </li>
        </div>
        <div class="transaction-block">
          <li class="transaction-info">
            <p class="block-label label-from">FROM</p>
            <p class="address">{{tx.getFrom().toString()}}</p>
          </li>
          <li class="transaction-info arrow_container">
            <div class="arrow_box">
              <p class="value">{{tx.getValue().toEth()}}</p>
              <p class="value-label">ETH</p>
            </div>
          </li>
          <li class="transaction-info"
              v-if="!tx.getContractAddress().toString()">
            <p class="block-label">TO</p>
            <p class="address">{{tx.getTo().toString()}}</p>
          </li>
          <li class="transaction-info"
              v-if="tx.getContractAddress().toString()">
            <p class="block-label">CONTRACT</p>
            <p class="address">{{tx.getContractAddress().toString()}}</p>
          </li>
        </div>
      </div>
    </div>
    <!-- .data-block -->
  </div>
  <!-- .data-container -->
</div>

</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'TableTransactions',
  props: [
    'transactions'
  ],
  created() {}
})

</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Sections/Tables/TableTransactionsNew.less";
</style>
