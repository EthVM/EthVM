<template>
  <div class="latesttransaction">

    <Header></Header>

    <div class="standard-table-1">
      <p class="table-title">
        <icon name='refresh'
              scale='1'></icon> Latest Transactions</p>
      <transition-group name="list">
        <div class="data-block-loop"
             v-for="tx in txSplice"
             v-bind:key="tx.getHash()">
          
          <!-- .data-block-1 -->
          <div class="data-block-1">
            <div>Hash <span>{{tx.getHash()}}</span></div>
            <div>Gas <span>{{tx.getGasUsed.toNumber().toString()}}</span></div>
            <div>Gas Price(Eth) <span>{{tx.getGasPrice.toEth()}}</span></div>
            <div>Block <span>{{tx.getBlockNumber.toNumber().toString()}}</span></div>
          </div>
          <!-- .data-block-1 -->
          
          <!-- .data-block-2 -->
          <div class="data-block-2">
            <div>
              <h1>From</h1>
              <p>{{tx.getFrom()}}</p>
            </div>
            <div>
              <div class="data-icon-container">
                <icon name='long-arrow-right'
                      scale='1'></icon> <span>(ETH)</span>
              </div>
              <p class="amount">{{tx.getValue.toEth()}}</p>
            </div>
            <div>
              <h1>To</h1>
              <p>{{tx.getTo()}}</p>
            </div>
          </div>
          <!-- .data-block-2 -->

          <!--sub txs -->
          <div class="data-block-sub">
            <div v-for="transfer in tx.getTrace().transfers">
                <div class="sub-icon">
                    <icon name='code-fork' scale='1'></icon>
                </div>
                <div>
                  <h1>From</h1>
                  <p>{{transfer.from}}</p>
                </div>
                <div>
                  <h1>To</h1>
                  <p>{{transfer.to}}</p>
                </div>
                <div>
                  <h1>Value</h1>
                  <p>{{transfer.value}}</p>
                </div>
                <div>
                  <h1>Type</h1>
                  <p>{{transfer.op}}</p>
                </div>
            </div>
          </div>
          <!--sub txs -->

        </div>
        <!-- .data-block-loop -->
      </transition-group>
    </div>
    <!-- .standard-table-1 -->


    <Footer></Footer>

  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import chartOptions from '@/sampleData/chartData.json'
export default Vue.extend({
  name: 'Block',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      store: store,
      options: chartOptions
    }
  },
  methods: {
    increment () {
      store.commit('incrementCount')
      this.$toasted.show(store.getters.getCount)
    }
  },
  mounted: function () {
    console.log('Page is fully loaded!!!')
  }
})
</script>
<style scoped lang="less">
@import '~lessPath/standardTables';

</style>
