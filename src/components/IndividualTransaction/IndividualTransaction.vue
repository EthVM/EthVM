<template>
  <div class="individualtransaction">
    <Header></Header>

    <div class="individualtransaction-container container">
      <div class="row">
        <div class="col-md-12">
          
          <div class="table-fields">
            <p class="title">Block Height 123123</p>
            
            <div class="data-block">
              
              <div class="data-top">
                <div>Hash <span>8723461243</span></div>
                <div>Gas <span>872HEUD</span></div>
                <div>Gas Price <span>231.99</span></div>
                <div>Block <span>823199</span></div>
              </div>
              
              <div class="data-mid">
          
                <div>
                  <p>From</p>
                  <p>12371248</p>
                </div>

                <div>
                  <p class="data-icon-container"><icon name='long-arrow-right' scale='1'></icon></p>
                  <p>23412.23</p>
                </div>

                <div>
                  <p>To</p>
                  <p>82437123</p>
                </div>

              </div>
              <!-- .data-mid -->

            </div>
            <!-- .data-block -->



            <div class="data-block">
              
              <div class="data-top">
                <div>Hash <span>8723461243</span></div>
                <div>Gas <span>872HEUD</span></div>
                <div>Gas Price <span>231.99</span></div>
                <div>Block <span>823199</span></div>
              </div>
              
              <div class="data-mid">
          
                <div>
                  <p>From</p>
                  <p>12371248</p>
                </div>

                <div>
                  <p class="data-icon-container"><icon name='long-arrow-right' scale='1'></icon></p>
                  <p>23412.23</p>
                </div>

                <div>
                  <p>To</p>
                  <p>82437123</p>
                </div>

              </div>
              <!-- .data-mid -->
                            
            </div>
            <!-- .data-block -->
          </div>
          <!-- .table-fields -->

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
@import "~lessPath/global.less";
@import "~lessPath/IndividualTransaction/IndividualTransaction.less";
</style>
