<template>
<div class="address-block">
    <div class="address" @mouseover="showIdenticon = true" @mouseleave="showIdenticon = false">{{address}}</div>
    <div v-show="showIdenticon" style="">identicon will be here</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ethAddress',
  props: ['address'],
  data () {
    return {
      showIdenticon: false
    }
  },
  computed: {}
})
</script>

<style scoped="" lang="less">
</style>
