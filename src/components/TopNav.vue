<template>
  <div class="topnav">

    <h1>Navigati</h1>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../states'
export default Vue.extend({
  name: 'TopNav',
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
  }
})
</script>

<style scoped lang="less">
@import "~lessPath/frontpage.less";
</style>
