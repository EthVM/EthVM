<template>
  <div class="last-transactions">

    <div class="block-body">
      <div class="block" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">
        <li>
          <div class="hash-block">
            <p class="hash"><router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</router-link></p>
          </div>
          <div class="fromto">
            <p class="title">From</p>
            <p class=""><router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}}</router-link></p>
                    
            <p class="title">To</p>
            <p class=""><router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link></p>
          </div>
        </li>
        <li class="vertical-middle eth">10</li>
        <li class="vertical-middle gas">{{tx.getGasUsed().toNumber()}}</li>
        <li class="vertical-middle"><p>{{tx.getGasPrice().toGWei()}}</p></li>
        <li class="vertical-middle status">
          <div v-if="!tx.getStatus()">
            <span class="glyphicon glyphicon-remove failed"></span>
          </div>
          <div v-else>
            <span class="glyphicon glyphicon-ok success"></span>
          </div>
        </li>
      </div>      
    </div>

    
    <div class="data-container hidden">
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
              <p class="address"><router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}}</router-link></p>
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
              <p class="address"><router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link></p>
            </li>
            <li class="transaction-info"
                v-if="tx.getContractAddress().toString()">
              <p class="block-label">CONTRACT</p>
              <p class="address"><router-link :to="'/address/'+tx.getContractAddress().toString()">{{tx.getContractAddress().toString()}}</router-link></p>
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
  @import "~lessPath/sunil/blocks/largeBlocks/lastTransactions.less";
</style>
