<template>
<div>
   <transition-group name="list">
  <div class="data-block"
       v-for="tx in transactions" v-bind:key="tx.getHash()">
    <div class="data-top">
      <div>Hash <span>{{tx.getHash()}}</span></div>
      <div>Gas <span>{{tx.getGasUsed.toNumber().toString()}}</span></div>
      <div>Gas Price <span>{{tx.getGasPrice.toEth()}}</span></div>
      <div>Block <span>{{tx.getBlockNumber.toNumber().toString()}}</span></div>
    </div>
    <div class="data-mid">
      <div>
        <p>From</p>
        <p>{{tx.getFrom()}}</p>
      </div>
      <div>
        <p class="data-icon-container">
          <icon name='long-arrow-right'
                scale='1'></icon>
        </p>
        <p>{{tx.getValue.toEth()}}</p>
      </div>
      <div>
        <p>To</p>
        <p>{{tx.getTo()}}</p>
      </div>
    </div>
    <!-- .data-mid -->
  </div>
</transition-group>
  <!-- .data-block -->
</div>

</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
export default Vue.extend({
  name: 'block-container',
  props: [
    'maxItems'
  ],
  data () {
    return {
      store: store
    }
  },
  mounted: function () {},
  computed: {
    transactions () {
      return store.getters.getTxs.slice(0, this.maxItems)
    }
  }
})
</script>

<style lang="less" scoped="">
@import "~lessPath/frontpage.less";
@import "~lessPath/latest-transection-table.less";
@import "~lessPath/animations.less";
</style>
