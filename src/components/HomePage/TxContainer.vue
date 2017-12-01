<template>
  <!-- .block-container -->
  <div class="block-container row">
    <div class="single-block">
      <div class="col-md-12">
        <div class="block">
          <p class="block-title">Latest Transaction</p>
          <div class="block-table">
            <table class="latest-transection-table">
              <thead>
                <tr>
                  <td>Hash</td>
                  <td>Age</td>
                  <td>From</td>
                  <td>To</td>
                  <td>Value</td>
                  <td>Fee</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in transactions">
                  <td>{{tx.hash}}</td>
                  <td>{{tx.age}}</td>
                  <td>{{tx.from}}</td>
                  <td>{{tx.to}}</td>
                  <td>{{tx.value}}</td>
                  <td>{{tx.fee}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- .block -->
      </div>
    </div>
    <!-- .single-block -->
  </div>
  <!-- .block-container -->
</template>

<script lang="ts">
import Vue from 'vue'
import Txs from '@/sampleData/transactions.json'
import store from '@/states'
export default Vue.extend({
  name: 'block-container',
  data () {
    return {
      store: store
    }
  },
  mounted: function () {
    store.commit('setTxs', Txs)
  },
  computed: {
    transactions () {
      return store.getters.getTxs
    }
  }
})
</script>

<style lang='less'>
@import "~lessPath/frontpage.less";
@import "~lessPath/latest-transection-table.less";
</style>
