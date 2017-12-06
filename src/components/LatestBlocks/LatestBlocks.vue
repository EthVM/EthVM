<template>
  <div class="latestblocks">
    <Header></Header>

    <div class="latestblocks-container container">
      <div class="row">
        <div class="col-md-12">
          
          <div class="table-fields">
            <p class="title">Latest Blocks</p>
            <table>
              
              <thead>
                <tr>
                  <td>Hash</td>
                  <td>Block</td>
                  <td>Age</td>
                  <td>From</td>
                  <td>To</td>
                  <td>Value</td>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>4</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>

            </table>

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
export default Vue.extend({
  name: 'LatestBlocks',
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
@import "~lessPath/global.less";
@import "~lessPath/latestblocks/latestblocks.less";
</style>
