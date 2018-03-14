<template>
  <div class="last-transactions">

    <div class="global-block-title">
      <div class="block-title">All Transactions</div>
      <div class="block-info">Total of 123,125 transactions</div>
    </div>

    <div class="block-body">

      <div class="labels">
        <div>TxHash <i class="fa fa-question-circle" aria-hidden="true"></i></div>
        <div>From</div>
        <dir></dir>
        <div>To</div>
        <div>ETH</div>
        <div>Gas <i class="fa fa-question-circle" aria-hidden="true"></i></div>
        <div>WEI <i class="fa fa-question-circle" aria-hidden="true"></i></div>
        <div>Status</div>
      </div>


      <div class="table-block" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">

        <div class="hash-block"><router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</router-link></div>
        <div class="hash-block"><router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}}</router-link></div>
        <div class="hash-block"><div class="in-out">IN</div></div>
        <div class="hash-block"><router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link></div>
        <div class="hash-block">100</div>
        <div class="hash-block">{{tx.getGasUsed().toNumber()}}</div>
        <div class="hash-block">{{tx.getGasPrice().toGWei()}}</div>
        <div class="hash-block status">
          <div v-if="!tx.getStatus()">
            <span class="glyphicon glyphicon-minus failed"></span>
          </div>
          <div v-else>
            <span class="glyphicon glyphicon-ok success"></span>
          </div>          
        </div>

      </div>


      <div class="block hidden" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">
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

  </div>
</template>


<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'TableTransactions',
  props: [
    'transactions'
  ],
  data() {
    return {
    }
  },
  created(){
  }
})

</script>

<style scoped="" lang="less">
  @import "~lessPath/sunil/blocks/largeBlocks/lastTransactions2.less";
</style>


