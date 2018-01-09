<template>
<div class="top-10-senders" :class="frompage">
  


  <p class="block-title">Top 10 Senders</p>
  
  </div>
</div>

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Top10Senders',
  props: ['frompage'],
  data () {
    return {
      blocks: [],
      showUncles: {}
    }
  },
  methods: {

  },
  beforeMount () {},
  created () {

  },
  beforeDestroy () {

  },
  computed: {

  },
  mounted () {

  }
})
</script>

<style scoped="" lang="less">
  @import "~lessPath/NewHome/Sections/Tables/TablesTop10Senders.less";
</style>
