<template>
  <div class="block">

    <div class="block-container container" v-if="tx">
      <div class="row">
        <div class="col-md-12 tx-section-block-1">
          <div class="section-block-title">
            <p>Transaction Detail Information</p>
          </div>
          <div class="section-block-container">
            <table>
              <tbody>
                <tr>
                  <td>Hash</td>
                  <td>
                    <p>{{tx.getHash().toString()}}</p>
                  </td>
                </tr>
                <tr>
                  <td>From</td>
                  <td>
                    <p>{{tx.getFrom().toString()}}</p>
                  </td>
                </tr>
                <tr>
                  <td>To</td>
                  <td>
                    <p>{{tx.getTo().toString()}}</p>
                  </td>
                </tr>
                <tr>
                  <td>Value</td>
                  <td>
                    <p>{{tx.getValue().toEth()}}&nbsp;ETH</p>
                  </td>
                </tr>



                <tr>
                  <td>Gas Used</td>
                  <td>
                    <p>{{tx.getGasUsed().toString()}}</p>
                  </td>
                </tr>

                <tr>
                  <td>Block Hash</td>
                  <td>
                    <p>{{tx.getBlockHash().toString()}}</p>
                  </td>
                </tr>

                <tr>
                  <td>Block Number</td>
                  <td>
                    <p>{{tx.getBlockNumber().toString()}}</p>
                  </td>
                </tr>

                <tr>
                  <td>Transaction Index</td>
                  <td>
                    <p>{{tx.geTransactionIndex().toString()}}</p>
                  </td>
                </tr>

                <tr>
                  <td>From Balance</td>
                  <td>
                    <p>{{tx.getFromBalance().toEth()}}</p>
                  </td>
                </tr>


                <tr>
                  <td>getToBalance</td>
                  <td>
                    <p>{{tx.getToBalance().toEth()}}</p>
                  </td>
                </tr>

                <tr>
                  <td>Cumulative Gas Used</td>
                  <td>
                    <p>{{tx.getCumulativeGasUsed().toNumber()}}</p>
                  </td>
                </tr>
     

                <tr>
                  <td>Gas</td>
                  <td>
                    <p>{{tx.getGas().toNumber()}}</p>
                  </td>
                </tr>



                <tr>
                  <td>Gas Price</td>
                  <td>
                    <p>{{tx.getGasPrice().toEth()}}&nbsp;Eth</p>
                  </td>
                </tr>



                <tr>
                  <td>Input</td>
                  <td>
                    <p>{{tx.getInput().toString()}}</p>
                  </td>
                </tr>

           

                <tr>
                  <td>Nonce</td>
                  <td>
                    <p>{{tx.getNonce().toString()}}</p>
                  </td>
                </tr>



                <tr>
                  <td>Value</td>
                  <td>
                    <p>{{tx.getValue().toEth()}}&nbsp;Eth</p>
                  </td>
                </tr>


                <tr>
                  <td>V</td>
                  <td>
                    <p>{{tx.getV().toString()}}</p>
                  </td>
                </tr>

                <tr>
                  <td>R</td>
                  <td>
                    <p>{{tx.getR().toString()}}</p>
                  </td>
                </tr>

                <tr>
                  <td>S</td>
                  <td>
                    <p>{{tx.getS().toString()}}</p>
                  </td>
                </tr>

                <tr>
                  <td>Satus</td>
                  <td>
                    <p>{{tx.getStatus().toString()}}</p>
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
    
  </div>


</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import {Tx, common} from '@/libs'
export default Vue.extend({
  name: 'Tx',
  data () {
    return {
      store: store,
      tx: null,
      common: common
    }
  },
  methods: {},
  mounted: function () {
    let _this = this
    this.$socket.emit('getTx', Buffer.from(this.$route.params.param.substring(2), 'hex'), (data) => {
      if (data) _this.tx = new Tx(data)
    })
  }
})
</script>

<style scoped="" lang="less">
  @import '~lessPath/NewHome/Sections/SinglePages/SinglePagesIndividualTransaction';

</style>
