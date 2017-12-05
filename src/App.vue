<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'app'
})
</script>

<style lang="less">
@import "~lessPath/global.less";
</style>

<style scoped lang="less">
@import "~lessPath/app.less";
</style>
