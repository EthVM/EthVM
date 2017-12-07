<template>
  <div class="frontpage">
    <Header></Header>

    <!-- contaner for front page sections -->
    <div class="section container">

      <!-- .container for three block on top -->
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
      <!-- end.container for three block on top -->

      <!-- .block-container Transactions-->
      <div class="block-container row">
        <div class="single-block">
          <div class="col-md-12">
            <div class="block">
              <div class="block-title">
                <img class="icon" src="/img/transicon.png">
                <p class= "title">Latest Transactions</p>
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
      <!-- end.block-container Transactions-->

      <!-- .block-container Blocks-->
      <div class="block-container row">
        <div class="single-block">
          <div class="col-md-12">
            <div class="block">
              <div class="block-title">
                <img class="icon" src="/img/blockicon.png">
                <p class="title">Latest Blocks</p>
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
      <!-- end.block-container Blocks-->

      <!-- .container for the chart and stats -->
    <div class="section container">
      <div class="block-container full-width-row">
        <!-- .two-block -->
        <div class="two-block height-400-px">
          <div class="chart-container col-md-6">
          <highcharts :options="options" ref="datachart"></highcharts>
          </div>
          <div class="col-md-6 height-100-per"> 
            <table class="table dark-block height-100-per vertical-middle-alignment">
              <tbody>
                <tr class="transactions ">
                  <td><p class="dark-block-data " > Transactions Per Day: </p></td>
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
        <!-- end.two-block -->

      </div>
    </div>
      <!-- .container for the chart and stats -->

    </div>
    <!-- end.contaner for front page sections -->


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

</style>
