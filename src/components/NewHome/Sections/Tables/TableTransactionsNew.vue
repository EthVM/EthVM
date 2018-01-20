<template>
   <div class="last-transactions">
      <p class="block-title2">Transactions</p>
      <p class="block-title3">Transactions users made on etherium newtwork</p>
      <div class="data-container">
         <div class="data-block" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">
            <div class="absolute-top-right-block">
               <div>
                  <p>GAS <span>{{tx.getGasUsed().toNumber()}}</span> / WEI <span>{{tx.getGasPrice().toGWei()}}</span></p>
               </div>
               <div v-if="!tx.getStatus()">
                  <p class="tx-status"><span class="glyphicon glyphicon-remove"></span>Unsuccessful</p>
               </div>
            </div>
            <div class="relative-block">
               <div class="tx-block">
                  <p>TX#&nbsp;<router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</router-link></p>
               </div>
               <div class="transaction-block">
                  <div class="transaction-info">
                     <p class="block-label label-from">FROM</p>
                     <p class="address">{{tx.getFrom().toString()}}</p>
                     
                  </div>
                  <div class="transaction-info arrow_box">
                     <p class="value">{{tx.getValue().toEth()}}</p>
                     <p class="value-label">ETH</p>
                  </div>
                  <div class="transaction-info">
                     <p class="block-label">TO</p>
                     <p class="address">{{tx.getTo().toString()}}</p>
                     
                  </div>
               </div>
            </div>
         </div><!-- .data-block -->
      </div><!-- .data-container -->
   </div>
</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'TableTransactions',
  props: ['transactions'],
  created (){}
})
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Tables/TableTransactionsNew.less";
</style>
