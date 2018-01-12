<template>
  <div id="TableTransactions" class="last-transactions">

    <p class="block-title">Transactions</p>

    <div class="table-container">
      <table class="table-header">
        <thead>
          <tr>
            <td>Status</td>
            <td>From</td>
            <td>Amount</td>
            <td>To</td>
          </tr>
        </thead>
      </table>

      <!-- MAIN LOOP START ########################################## -->
      <div class="table-content" v-for="tx in getTransactions" v-bind:key="tx.getHash().toString()">
        <table class="top-table-content">
          <tbody>
            <tr>
              <td class="top-status"><p v-if="!tx.getStatus()"><span>Fail</span></p><p v-if="tx.getStatus()"><span>Success</span></p></td>
              <td class="top-from"><p><span>{{tx.getFrom().toString()}}</span></p></td>
              <td class="top-amount"><p><span>{{tx.getValue().toEth()}}</span>&nbsp;ETH</p></td>
              <td class="top-to"><p><span>{{tx.getTo().toString()}}</span></p></td>
            </tr>
          </tbody>
        </table>
        
        <table class="mid-table-content">
          <tbody>
            <tr>
              <td class="mid-hash-value"><icon name='hashtag' scale='1'></icon>&nbsp;<p> <router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</router-link></p></td>
              <td class="mid-gas"><icon name='tint' scale='1'></icon>&nbsp;<p>{{tx.getGasUsed().toNumber()}}&nbsp;Gas</p></td>
              <td class="mid-gwei"><icon name='database' scale='1'></icon>&nbsp;<p>{{tx.getGasPrice().toGWei()}}&nbsp;GWEI</p></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- MAIN LOOP END ########################################## -->

    </div>
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
  @import "~lessPath/NewHome/Sections/Tables/TableTransactions.less";
</style>
