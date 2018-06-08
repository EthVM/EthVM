<template>
  <div class="last-transactions">
    <!-- If no Transactions: -->
    <div v-if="total == 0" class="info">
      <p>{{getText}}</p>
    </div>
    <div v-else class="block-body">
      <div class="block-header" v-if="showheader === true">
        <li>TXn#</li>
        <li class="type"></li>
        <li class="eth">ETH</li>
        <li class="limit">Gas Limit</li>
        <li class="gas">GWEI</li>
        <li class="status"></li>
      </div>

      <div class="block" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">
        <li>
          <div class="hash-block">
            <p class="hash">
              <router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</router-link>
            </p>
          </div>
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
          </div>
        </li>

        <li class="vertical-middle type">
          <div v-if="tx.type == 'out'">
            <span class="failed">Out</span>
          </div>
          <div v-else>
            <span class="success">In</span>
          </div>
        </li>

        <li class="vertical-middle eth">
          <div class="">{{getShortEthValue(tx.getValue().toEth().toString(), false)}}</div>
          <div v-if="getShortEthValue(tx.getValue().toEth().toString(), true)" class="tooltip-button" v-tooltip="tx.getValue().toEth()"><i class="fa fa-question-circle-o" aria-hidden="true"></i></div>
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
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'TableTransactions',
  props: [
    'transactions',
    'showheader',
    'account',
    'filter',
    'total'
  ],
  created() {

  },
  methods: {
    getType(address){
        let _this = this
        if(address == _this.account) return true
            return false
    },
    getShortEthValue(newEthValue, isBool) {
      let length = newEthValue.length;
      let isShort = false;
      if (length > 6) {
        newEthValue = newEthValue.slice(0, 6) + "...";
        isShort = true;
      }
      if (!isBool)
        return newEthValue;
      else
        return isShort;
    }
  },
  computed: {
    getText(){
      let _this = this
      if (_this.filter == 'all') return "This address does not have any transaction history"
      else if(_this.filter == 'in') return "This address does not have incoming transactions"
      else {
        return "This address does not have outgoing transactions"
     } 
   }
  }
})
</script>
<style scoped lang="less">
@import "~lessPath/sunil/blocks/largeBlocks/addressTxTable.less";
</style>
