<template>
  <div class="latesttransaction">

    <Header></Header>

    <div class="container">
      <div class="row">
        <div class="col-md-12">



          <div class="table-1">
            <p class="table-title">
              <icon name='refresh' scale='1'></icon> Latest Transactions
            </p>

            <div class="data-block-loop">
              





              <!-- .data-block-1 -->
              <div class="data-block-1">
                <div>Hash <span>0X02EC1095BCC5A5E1EBEF04A445A628692F1C8ED7A252F57571B1174E2BD9E1B1</span></div>
                <div>Gas <span>21000</span></div>
                <div>Gas Price(Eth) <span>0.00000002226</span></div>
                <div>Block <span>4757137</span></div>
              </div>
              <!-- .data-block-1 -->
              






              <!-- .data-block-2 -->
              <div class="data-block-2">
                <div>
                  <h1>From</h1>
                  <p>0xd24400ae8BfEBb18cA49Be86258a3C749cf46853</p>
                </div>
                <div>
                  <div class="data-icon-container">
                    <icon name='long-arrow-right'
                          scale='1'></icon> <span>(ETH)</span>
                  </div>
                  <p class="amount">8.14501795</p>
                </div>
                <div>
                  <h1>To</h1>
                  <p>0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE</p>
                </div>
              </div>
              <!-- .data-block-2 -->






              <!--sub txs -->
              <div class="data-block-sub">
                <div class="sub-loop-point">
                    <div class="sub-icon">
                        <icon name='code-fork' scale='1'></icon>
                    </div>
                    <div class="sub-data-container">
                      <div class="sub-data-block">
                        <h1>From</h1>
                        <p>0x0b95993a39a363d99280ac950f5e4536ab5c5566</p>
                      </div>
                      <div class="sub-data-block">
                        <h1>To</h1>
                        <p>0x0ec110487c86b87cec37e64561f0ea45a6431992</p>
                      </div>
                      <div class="sub-data-block">
                        <h1>Value</h1>
                        <p>0x1550f7dca70000</p>
                      </div>
                      <div class="sub-data-block">
                        <h1>Type</h1>
                        <p>CALL</p>
                      </div>
                    </div>

                </div>
              </div>
              <!--sub txs -->






            </div>
            <!-- .data-block-loop -->
          
          </div>
          <!-- .table-1 -->




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
@import '~lessPath/LatestTransaction/LatestTransaction';

</style>
