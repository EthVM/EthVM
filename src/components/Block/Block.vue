<template>
  <div class="block">
    <Header></Header>
    <div class="block-container container" v-if="block">
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
                  <td><p>{{common.HexNumber(block.getNumber()).toNumber()}}</p></td>
                </tr>                
                <tr>
                  <td>Logs</td>
                  <td><p>{{block.getLogsBloom().length}}</p></td>
                </tr>
                <tr>
                  <td>Timestamp</td>
                  <td><p>{{timestamp}}</p></td>
                </tr>
                <tr>
                  <td>Transactions</td>
                  <td><p>{{block.getTransactions().length}}</p></td>
                </tr>
                <tr>
                  <td>Hash</td>
                  <td><p>{{block.getHash()}}</p></td>
                </tr>
                <tr>
                  <td>Parent Hash</td>
                  <td><a v-bind:href="'/block/' + block.getParentHash()"><p>{{block.getParentHash()}}</p></a></td>
                </tr>
                <tr>
                  <td>Uncles Hash</td>
                  <td><p>{{block.getSha3Uncles()}}</p></td>
                </tr>
                <tr>
                  <td>Miner</td>
                  <td><p>{{block.getMiner()}}</p></td>
                </tr>
                <tr>
                  <td>Nonce</td>
                  <td><p>{{block.getNonce()}}</p></td>
                </tr>
                
                <tr>
                  <td>State Root</td>
                  <td><p>{{block.getStateRoot()}}</p></td>
                </tr>
                <tr>
                  <td>Extra Data</td>
                  <td><p>{{block.getExtraData()}}</p></td>
                </tr>
                <tr>
                  <td>Size</td>
                  <td><p>{{common.HexNumber(block.getSize()).toNumber()}}</p></td>
                </tr>
                <tr>
                  <td>Gas Limit</td>
                  <td><p>{{common.HexNumber(block.getGasLimit()).toNumber()}}</p></td>
                </tr>
                <tr>
                  <td>Gas Used</td>
                  <td><p>{{common.HexNumber(block.getGasUsed()).toNumber()}}</p></td>
                </tr>
                

                <tr>
                  <td>Transactions Root</td>
                  <td><p>{{block.getTransactionsRoot()}}</p></td>
                </tr>

                <tr>
                  <td>Receipts Root</td>
                  <td><p>{{block.getReceiptsRoot()}}</p></td>
                </tr>

                <tr>
                  <td>TX Fees</td>
                  <td><p>{{common.HexNumber(block.getTxFees()).toNumber()}}&nbsp;ETH</p></td>
                </tr>

                <tr>
                  <td>Block Reward</td>
                  <td><p>{{common.HexNumber(block.getBlockReward()).toNumber()}}&nbsp;ETH</p></td>
                </tr>


                <tr>
                  <td>Total BlockReward</td>
                  <td><p>{{common.HexNumber(block.getTotalBlockReward()).toNumber()}}&nbsp;ETH</p></td>
                </tr>
                <tr>
                  <td>SHA3 Uncles</td>
                  <td><p>{{block.getSha3Uncles()}}</p></td>
                </tr>
                <tr>
                  <td>Difficulty</td>
                  <td><p>{{common.HexNumber(block.getDifficulty()).toNumber()}}</p></td>
                </tr>
                <tr>
                  <td>Total Difficulty</td>
                  <td><p>{{common.HexNumber(block.getTotalDifficulty()).toNumber()}}</p></td>
                </tr>



              </tbody>

            </table>
          </div>
        </div><!-- .section-block-1 -->
      </div><!-- .row -->



      <div class="row" v-for="uncle in uncles">

        <div class="col-md-6 section-block-1">
            
          <div class="section-block-title">
            <p>Uncle</p>
          </div>

          <div class="section-block-container">

            <table>              
              <tbody>                
                <tr>
                  <td>Height</td>
                  <td><p>{{common.HexNumber(uncle.getNumber()).toNumber()}}</p></td>
                </tr>
                <tr>
                  <td>Hash</td>
                  <td><a v-bind:href="'/block/' + uncle.getHash()"><p class="short-data">{{uncle.getHash()}}</p></a></td>
                </tr>
                <tr>
                  <td>Block Reward</td>
                  <td><p>{{common.EthValue(uncle.getBlockReward()).toEth()}}&nbsp;ETH</p></td>
                </tr>
              </tbody>

            </table>
          </div>
        </div><!-- .section-block-1 -->
      </div><!-- .row -->



    </div><!-- .container -->
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
      common: common,
      uncles: [],
      unixtimestamp: null,
      timestamp: null
    }
  },
  methods: {},
  mounted: function () {
    let _this = this
    this.$socket.emit('getBlock', this.$route.params.hash, (data) => {
      if (data) {
        _this.block = new Block(data)

        let uncleHashes = _this.block.getUncleHashes()
        uncleHashes.forEach((_hash: Block, idx: number) => {
          _this.$socket.emit('getBlock', _hash, (data) => {
            _this.uncles.push(new Block(data))
          })
        })
      }

      // Get time stamp for this block and convert it to date format string.
      _this.unixtimestamp = common.HexNumber(_this.block.getTimestamp()).toNumber()
      var tstamp = _this.unixtimestamp
      _this.timestamp = new Date(tstamp * 1000).toString()
    })
    this.$socket.emit('getTx', '0X97FBCBA8B77F6726AFED5A1DB6A85D4417F50DBC53F82BBC61CE7938C1B7A5BE', (data) => {
      console.log(data)
    })
    console.log('Page is fully loaded!!!')
  }

})
</script>


<style scoped="" lang="less">
  @import '~lessPath/Block/Block';

</style>
