<template>
  <div id="app">
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'app'
})
</script>

<style lang="less">
</style>
