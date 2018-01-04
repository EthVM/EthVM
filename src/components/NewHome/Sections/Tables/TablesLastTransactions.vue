<template>
  <div id="TablesLastTransactions" class="last-transactions">

    <p class="block-title">Last Transactions</p>

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
      <div class="table-content" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">
        <table class="top-table-content">
          <tbody>
            <tr>
              <td><p>Fail</p></td>
              <td class="top-hash"><p>{{tx.getHash().toString()}}</p></td>
              <td class="top-miner"><p>0.234&nbsp;ETH</p></td>
              <td class="top-hash"><p>324f0j9g0453g9h3g9h34f340g3j04gf9j34</p></td>
            </tr>
          </tbody>
        </table>
        
        <table class="mid-table-content">
          <tbody>
            <tr>
              <td><icon name='plus-square-o' scale='1'></icon>&nbsp;<p>0&nbsp;Sub</p></td>
              <td class="mid-hash-value"><icon name='hashtag' scale='1'></icon>&nbsp;<p>2ljknruegn897h43938476</p></td>
              <td><icon name='tint' scale='1'></icon>&nbsp;<p>4523123&nbsp;Gas</p></td>
              <td><icon name='database' scale='1'></icon>&nbsp;<p>55&nbsp;GWEI</p></td>
            </tr>
          </tbody>
        </table>

        <!-- SUB LOOP START ############## -->
        <div class="sub-contents">
          <table>
            <tbody>
              <tr>
                <td class="sub-height"><p>Height:&nbsp;<span>237534</span></p></td>
                <td class="sub-miner"><p>Miner:&nbsp;<span>2iu3498gg9ngn3eg934gun389g37534</span></p></td>
                <td class="sub-reward"><p>Reward:&nbsp;<span>237534</span></p></td>
              </tr>
            </tbody>
          </table>
        </div>        
        <div class="sub-contents">
          <table>
            <tbody>
              <tr>
                <td class="sub-height"><p>Height:&nbsp;<span>237534</span></p></td>
                <td class="sub-miner"><p>Miner:&nbsp;<span>2iu3498gg9ngn3eg934gun389g37534</span></p></td>
                <td class="sub-reward"><p>Reward:&nbsp;<span>237534</span></p></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- SUB LOOP END ############## -->

      </div>
      <!-- MAIN LOOP END ########################################## -->

    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import { common } from '@/libs'
export default Vue.extend({
  name: 'TablesLastTransactions',
  data () {
    return {
      store: store,
      txSplice: [],
      common: common
    }
  },
  mounted () {
    // let _this = this
    this.$nextTick(function () {
      this.$socket.emit('pastData', ''
      )
    }
    )
  },
  computed: {
    transactions () {
      return store.getters.getTxs.slice(0, 50)
    }
  }
})
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Tables/TablesLastTransactions.less";
</style>
