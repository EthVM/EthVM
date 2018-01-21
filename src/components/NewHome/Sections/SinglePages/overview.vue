<template>
<div class="overview">
  <div class="block-container">
    <div class="tx-section-block-1">
      <div class="section-block-container">
        <p class="block-title">Overview</p>
        

      </div>
    </div>
    <!-- .section-block-1 -->
  </div>
  <!-- .block-container -->
</div>

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Overview',
  props: ['account'],
  data() {
    return {

    }
  },
  methods: {}

})

</script>

<style scoped="" lang="less">
@import '~lessPath/NewHome/Sections/SinglePages/overview';
</style>
