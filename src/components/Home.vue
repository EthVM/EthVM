<template>
  <div class="frontpage">
    <Header></Header>
    <div class="section container">
      <div class="block-container row full-width-row ">
        
        <div class="three-block ">
           
          <div class="col-md-4 top-data-block">
            <div class="dark-block ">
              <p class="block-title-link">Last Transaction</p>
              <p class="dark-block-data">Hash number: 83402435..</p>
            
            </div>
          </div>
          <div class="col-md-4 top-data-block">
             
            <div class="dark-block ">
              <p class="block-title-link">Last Block</p>
              <p class="dark-block-data">Height: 238530</p>
            </div>
           
          </div>
          <div class="col-md-4 top-data-block">
             
            <div class="dark-block ">
              <p class="block-title-link">Hash Rate</p>
              <p class="dark-block-data">11,539,384 THs </p>
            </div>

          </div>
        </div>

      </div>
      <!-- .block-container -->
      <div class="block-container row">
        <div class="single-block">
          <div class="col-md-12">
            <div class="block">
              <div class="block-title">
                <img class="icon" src="/img/transicon.png">
                <p class= "block-title-link">Latest Transactions</p>
              </div>
              <div class="block-table">
                <hp-tx-container></hp-tx-container>
              </div>
            </div>
            <!-- .block -->
          </div>
        </div>
        <!-- .single-block -->
      </div>
      <!-- .block-container -->
      <div class="block-container row">
        <div class="single-block">
          <div class="col-md-12">
            <div class="block">
              <div class="block-title">
                <img class="icon" src="/img/blockicon.png">
                <p class="block-title-link">Latest Blocks</p>
              </div>
              <div class="block-table">
                <hp-block-container></hp-block-container>
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
        <div class="two-block height-400-px">
          <div class="chart-container col-md-6">
            <highcharts :options="options" ref="datachart"></highcharts>
            <!-- .block -->
          </div>
          <div class="col-md-6 height-100-per"> 
            <!-- .block -->
            <table class="table dark-block height-100-per">
              <tbody>
                <tr class="transactions">
                  <td><p class="dark-block-data  " style="padding-top: 10px"> Transactions Per Day: </p></td>
                  <td><p class="block-title-link "> 3,874,038 </p></td>
                </tr>
                <tr class="marketcap">
                  <td><p class="dark-block-data " style="padding-top: 10px"> Market Cap: </p></td>
                  <td><p class="block-title-link"> $632,930,874,038 </p></td>
                </tr>
                <tr class="hashrate">
                  <td><p class="dark-block-data " style="padding-top: 10px" > Hash Rate </p></td>
                  <td><p class="block-title-link"> 20,874,038  TH/s</p></td>
                </tr>
                    
              </tbody>
              </table>
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
import chartOptions from '@/sampleData/chartData.json'
export default Vue.extend({
  name: 'FrontPage',
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
@import "~lessPath/frontpage.less";
@import "~lessPath/latest-blocks-table";
</style>
