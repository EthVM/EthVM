<template>
<div class="block">
  <Header></Header>
  <div class="block-container container"
       v-if="block">
    <div class="row">
      <div class="col-md-12 section-block-1">
        <div class="section-block-title">
          <p>Block Detail Information</p>
        </div>
        <div class="section-block-container">
          <table>
            <tbody>
              <tr>
                <td>Height</td>
                <td>
                  <p>{{block.getNumber().toNumber()}}</p>
                </td>
              </tr>
              <tr>
                <td>Logs</td>
                <td>
                  <p>{{block.getLogsBloom().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Timestamp</td>
                <td>
                  <p>{{block.getTimestamp().toDate().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Transactions</td>
                <td>
                  <p>{{block.getTransactionCount()}}</p>
                </td>
              </tr>
              <tr>
                <td>Hash</td>
                <td>
                  <p>{{block.getHash().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Parent Hash</td>
                <td>
                  <a v-bind:href="'/block/' + block.getParentHash().toString()">
                    <p>{{block.getParentHash().toString()}}</p>
                  </a>
                </td>
              </tr>
              <tr>
                <td>Uncles Hash</td>
                <td>
                  <p>{{block.getSha3Uncles().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Miner</td>
                <td>
                  <p>{{block.getMiner().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Nonce</td>
                <td>
                  <p>{{block.getNonce().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>State Root</td>
                <td>
                  <p>{{block.getStateRoot().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Extra Data</td>
                <td>
                  <p>{{block.getExtraData().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Size</td>
                <td>
                  <p>{{block.getSize().toNumber()}}</p>
                </td>
              </tr>
              <tr>
                <td>Gas Limit</td>
                <td>
                  <p>{{block.getGasLimit().toNumber()}}</p>
                </td>
              </tr>
              <tr>
                <td>Gas Used</td>
                <td>
                  <p>{{block.getGasUsed().toNumber()}}</p>
                </td>
              </tr>
              <tr>
                <td>Transactions Root</td>
                <td>
                  <p>{{block.getTransactionsRoot().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Receipts Root</td>
                <td>
                  <p>{{block.getReceiptsRoot().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>TX Fees</td>
                <td>
                  <p>{{block.getTxFees().toEth()}}&nbsp;ETH</p>
                </td>
              </tr>
              <tr>
                <td>Block Reward</td>
                <td>
                  <p>{{block.getBlockReward().toEth()}}&nbsp;ETH</p>
                </td>
              </tr>
              <tr>
                <td>Total BlockReward</td>
                <td>
                  <p>{{block.getTotalBlockReward().toEth()}}&nbsp;ETH</p>
                </td>
              </tr>
              <tr>
                <td>SHA3 Uncles</td>
                <td>
                  <p>{{block.getSha3Uncles().toString()}}</p>
                </td>
              </tr>
              <tr>
                <td>Difficulty</td>
                <td>
                  <p>{{block.getDifficulty().toNumber()}}</p>
                </td>
              </tr>
              <tr>
                <td>Total Difficulty</td>
                <td>
                  <p>{{block.getTotalDifficulty().toNumber()}}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- .section-block-1 -->
    </div>
    <!-- .row -->
    <div class="row"
         v-for="uncle in uncles">
      <div class="col-md-6 section-block-1">
        <div class="section-block-title">
          <p>Uncle</p>
        </div>
        <div class="section-block-container">
          <table>
            <tbody>
              <tr>
                <td>Height</td>
                <td>
                  <p>{{uncle.getNumber().toNumber()}}</p>
                </td>
              </tr>
              <tr>
                <td>Hash</td>
                <td>
                  <a v-bind:href="'/block/' + uncle.getHash().toString()">
                    <p class="short-data">{{uncle.getHash().toString()}}</p>
                  </a>
                </td>
              </tr>
              <tr>
                <td>Block Reward</td>
                <td>
                  <p>{{uncle.getBlockReward().toEth()}}&nbsp;ETH</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- .section-block-1 -->
    </div>
    <!-- .row -->
  </div>
  <!-- .container -->
  <Footer></Footer>
</div>

</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import chartOptions from '@/sampleData/chartData.json'
import { Block, common } from '@/libs'
export default Vue.extend({
  name: 'Block',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      store: store,
      options: chartOptions,
      block: null,
      common: common,
      uncles: [],
      unixtimestamp: null,
      timestamp: null
    }
  },
  methods: {},
  mounted: function () {
    let _this = this
    this.$socket.emit('getBlock', Buffer.from(this.$route.params.hash.substring(2), 'hex'), (data) => {
      if (data) {
        _this.block = new Block(data)
        let uncleHashes = _this.block.getUncleHashes()
        uncleHashes.forEach((_hash: any, idx: number) => {
          _this.$socket.emit('getBlock', _hash.toBuffer(), (data) => {
            _this.uncles.push(new Block(data))
          })
        })
      }

      // Get time stamp for this block and convert it to date format string.
    })
    console.log('Page is fully loaded!!!')
  }

})
</script>

<style scoped="" lang="less">
@import '~lessPath/Block/Block';
</style>
