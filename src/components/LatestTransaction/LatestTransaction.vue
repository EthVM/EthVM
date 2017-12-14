<template>
  <div class="latesttransaction">
    <Header></Header>

    <div class="latesttransaction-container container">
      <div class="row">
        <div class="col-md-12">
          
          <div class="table-fields">
            <p class="title">Block Height 123123</p>
            <table>
           

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
@import "~lessPath/latesttransaction/latesttransaction.less";
</style>
