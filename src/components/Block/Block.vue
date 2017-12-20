<template>
  <div class="block">
    <Header></Header>
    <div class="block-container container" v-if="block">
      <div class="row">
        
        <div class="col-md-12">
          <div class="section-block-1">
            
            <div class="section-block-title">
              <p>Block Detail Information</p>
            </div>

            <table>
              
              <tbody>                
                <tr>
                  <td>Height</td>
                  <td>{{common.HexNumber(block.getNumber()).toNumber()}}</td>
                </tr>                
                <tr>
                  <td>Logs</td>
                  <td>{{block.getLogsBloom().length}}</td>
                </tr>
                <tr>
                  <td>Timestamp</td>
                  <td>{{common.HexNumber(block.getNumber()).toNumber()}}</td>
                </tr>
                <tr>
                  <td>Transactions</td>
                  <td>{{block.getTransactions().length}}</td>
                </tr>
                <tr>
                  <td>Hash</td>
                  <td>{{block.getHash()}}</td>
                </tr>
                <tr>
                  <td>Parent Hash</td>
                  <td>{{block.getParentHash()}}</td>
                </tr>
                <tr>
                  <td>Uncles Hash</td>
                  <td>{{block.getSha3Uncles()}}</td>
                </tr>
                <tr>
                  <td>Miner</td>
                  <td>{{block.getMiner()}}</td>
                </tr>
                <tr>
                  <td>Nonce</td>
                  <td>{{block.getNonce()}}</td>
                </tr>
                
                <tr>
                  <td>State Root</td>
                  <td>{{block.getStateRoot()}}</td>
                </tr>
                <tr>
                  <td>Extra Data</td>
                  <td>{{block.getExtraData()}}</td>
                </tr>
                <tr>
                  <td>Size</td>
                  <td>{{block.getSize()}}</td>
                </tr>
                <tr>
                  <td>Gas Limit</td>
                  <td>{{block.getGasLimit()}}</td>
                </tr>
                <tr>
                  <td>Gas Used</td>
                  <td>{{block.getGasUsed()}}</td>
                </tr>
                

                <tr>
                  <td>Transactions Root</td>
                  <td>{{block.getTransactionsRoot()}}</td>
                </tr>

                <tr>
                  <td>Receipts Root</td>
                  <td>{{block.getReceiptsRoot()}}</td>
                </tr>

                <tr>
                  <td>TX Fees</td>
                  <td>{{block.getTxFees()}}</td>
                </tr>

                <tr>
                  <td>Block Reward</td>
                  <td>{{block.getBlockReward()}}</td>
                </tr>


                <tr>
                  <td>Total BlockReward</td>
                  <td>{{block.getTotalBlockReward()}}</td>
                </tr>
                <tr>
                  <td>SHA3 Uncles</td>
                  <td>{{block.getSha3Uncles()}}</td>
                </tr>
                <tr>
                  <td>Difficulty</td>
                  <td>{{block.getDifficulty()}}</td>
                </tr>
                <tr>
                  <td>Total Difficulty</td>
                  <td>{{block.getTotalDifficulty()}}</td>
                </tr>



              </tbody>

            </table>
          </div>
        </div>



        <div class="col-md-12 hidden">
          <div class="section-block">
            <p class="title">Height {{common.HexNumber(block.getNumber()).toNumber()}}</p>
            <p class="title">Timestamp {{common.HexNumber(block.getNumber()).toNumber()}}</p>
            <p class="title">Transactions {{block.getTransactions().length}}</p>
            <p class="title">Hash {{block.getHash()}}</p>
            <p class="title">Parent Hash {{block.getParentHash()}}</p>
            <p class="title">Uncles Hash {{block.getSha3Uncles()}}</p>
            <p class="title">Miner {{block.getMiner()}}</p>
          </div>
        </div>

      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import chartOptions from '@/sampleData/chartData.json'
import {Block, common} from '@/libs'
export default Vue.extend({
  name: 'Block',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      store: store,
      options: chartOptions,
      block: null,
      common: common
    }
  },
  methods: {},
  mounted: function () {
    let _this = this
    this.$socket.emit('getBlock', this.$route.params.hash, (data) => {
      if (data) _this.block = new Block(data)
    })
    console.log('Page is fully loaded!!!')
  }
})
</script>

<style scoped="" lang="less">
  @import '~lessPath/Block/Block';

</style>
