<template>
  <div class="frontpage">
    <Header></Header>
    <div class="section container">
      <div class="block-container row">
        <div class="three-block">
          <div class="col-md-4">
            <div class="block">
              <p class="block-title">Latest Transaction</p>
              <p class="block-data">Hash number: 83402435203952130</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="block">
              <p class="block-title">Latest Block</p>
              <p class="block-data">Height: 20</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="block">
              <p class="block-title">Hash Rate</p>
              <p class="block-data">Rate: 20%</p>
            </div>
          </div>
        </div>
      </div>
      <hp-tx-container></hp-tx-container>
      <div class="block-container row">
        <div class="single-block">
          <div class="col-md-12">
            <div class="block">
              <p class="block-title">Latest Blocks</p>
              <div class="block-table">
                <table class="latest-blocks-table">
                  <thead>
                    <tr>
                      <td>Height</td>
                      <td>Age</td>
                      <td>Transactions</td>
                      <td>Block Reward</td>
                      <td>Size</td>
                      <td>Weight</td>
                      <td>Relayed by</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
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
    </div>


    <!-- .container -->
    <div class="section container hidden">
      <div class="block-container row">
        <div class="two-block">
          <div class="user-note-block col-md-6">
            <div class="block">
              <p class="block-title">NEW TO DIGITAL CURRENCIES?</p>
              <p class="block-data">
                Like paper money and gold before it, bitcoin and ether allow parties to exchange value. Unlike their predecessors, they are digital and decentralized. For the first time in history, people can exchange value without intermediaries which translates to greater control of funds and lower fees.
              </p>
            </div>
            <!-- .block -->
          </div>
          <div class="search-block col-md-6">
            <div class="block">
              <p class="block-title">Search</p>
              <p class="search-text">You may enter a block height, address, block hash, transaction hash, hash160, or ipv4 address...</p>
              <input class="form-control" type="search" value="Search" id="example-search-input">
              <button type="button" class="btn btn-primary">Search</button>
            </div>
          </div>
        </div>
        <!-- .two-block -->
      </div>
    </div>
    <div class="section container">
      <div class="block-container row">
        <div class="two-block">
          <div class="chart-container col-md-6">
            <div class="block">
              <p class="block-title">Interactive Chart</p>
              <img class="" src="/img/graph.png">
            </div>
            <!-- .block -->
          </div>
          <div class="col-md-6">
            <div class="block">
              <p class="block-title">TRANSACTIONS PER DAY</p>
              <p class="block-data-b">3,437,345,992</p>
              <p class="block-title">MARKET CAP</p>
              <p class="block-data-b">$9,437,345,992</p>
              <p class="block-title">HASH RATE</p>
              <p class="block-data-b">30,437,345 TH/s</p>
            </div>
            <!-- .block -->
          </div>
        </div>
        <!-- .two-block -->
      </div>
    </div>

    <Footer></Footer>

  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import store from '@/states'
  export default Vue.extend({
    name: 'FrontPage',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        store: store
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
  @import "~lessPath/frontpage.less";
  @import "~lessPath/latest-blocks-table";
  
</style>