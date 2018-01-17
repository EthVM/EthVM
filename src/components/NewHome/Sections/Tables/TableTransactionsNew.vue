<template>
   <div class="last-transactions">
      <p class="block-title">Transactions New</p>
      <div class="data-container">
         <div class="data-block" v-for="tx in getTransactions" v-bind:key="tx.getHash().toString()">
            <div class="absolute-top-right-block">
               <div>
                  <p><span>{{tx.getGasUsed().toNumber()}}</span>GAS / <span>{{tx.getGasPrice().toGWei()}}</span>WEI</p>   
               </div>
               <div v-if="!tx.getStatus()">
                  <p class="tx-status">Unsuccessful</p>
               </div>               
            </div>
            <div class="relative-block">
               <div class="tx-block">
                  <p>TX#&nbsp;<router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}...</router-link></p>
               </div>
               <div class="transaction-block">
                  <div class="transaction-info">
                     <p class="address">{{tx.getFrom().toString()}}...</p>
                     <p class="block-label">from</p>
                  </div>
                  <div class="transaction-info arrow_box">
                     <p class="value">{{tx.getValue().toEth()}}</p><p class="value-label">ETH</p>
                  </div>
                  <div class="transaction-info">
                     <p class="address">{{tx.getTo().toString()}}...</p>
                     <p class="block-label">to</p>
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
  computed: {
    getTransactions () {
      return this.transactions
    }
  }
})
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Tables/TableTransactionsNew.less";
</style>
