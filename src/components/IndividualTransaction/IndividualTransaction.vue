<template>
  <div class="block">
    <Header></Header>

    <div class="block-container container"
       v-if="tx">
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
    this.$socket.emit('getTx', Buffer.from(this.$route.params.hash.substring(2), 'hex'), (data) => {
      if (data) _this.tx = new Tx(data)
    })
    console.log('Page is fully loaded!!!')
  }
})
</script>

<style scoped="" lang="less">
  @import '~lessPath/IndividualTransaction/IndividualTransaction';

</style>
