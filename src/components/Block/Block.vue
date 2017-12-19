<template>
<div class="block">
  <Header></Header>
  <div class="block-container container" v-if="block">
    <div class="row">
      <div class="col-md-12">
        <div class="table-fields">
          <p class="title">Height {{common.HexNumber(block.getNumber()).toNumber()}}</p>
          <p class="title">Timestamp {{common.HexNumber(block.getNumber()).toNumber()}}</p>
          <p class="title">Transactions {{block.getTransactions().length}}</p>
          <p class="title">Hash {{block.getHash()}}</p>
          <p class="title">Parent Hash {{block.getParentHash()}}</p>
          <p class="title">Uncles Hash {{block.getSha3Uncles()}}</p>
          <p class="title">Miner {{block.getMiner()}}</p>
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
import {Block, common} from '@/libs'
export default Vue.extend({
  name: 'Block',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      store: store,
      options: chartOptions,
      block: null,
      common: common
    }
  },
  methods: {},
  mounted: function () {
    let _this = this
    this.$socket.emit('getBlock', this.$route.params.hash, (data) => {
      if (data) _this.block = new Block(data)
    })
    console.log('Page is fully loaded!!!')
  }
})
</script>

<style scoped="" lang="less">
</style>
