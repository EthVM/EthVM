<template>
<div class="progress">
  <div class="progress-bar"
       role="progressbar"
       :style="'width: ' + percentage + '%;'"
       :aria-valuenow="value"
       aria-valuemin="0"
       :aria-valuemax="maxValue">{{percentage}}%</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'usageBar',
  props: ['value', 'maxValue'],
  data () {
    return {}
  },
  computed: {
    percentage () {
      return Math.ceil((this.value / this.maxValue) * 100)
    }
  }
})
</script>

<style scoped="" lang="less">
</style>
