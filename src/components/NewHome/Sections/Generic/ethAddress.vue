<template>
<div class="address-block">
<div class="address">{{address}}</div>
<div style=""></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ethAddress',
  props: ['address'],
  data () {
    return {}
  },
  computed: {}
})
</script>

<style scoped="" lang="less">
</style>
