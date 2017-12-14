<template>

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
