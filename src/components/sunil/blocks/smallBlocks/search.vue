<template>
  <div class="search">
    <input type="text" name="search" placeholder="Search Hash / Miner / From">
    <button><i class="fa fa-search"></i></button>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'Search',
    data() {
      return {
        
      }
    }

  })
</script>
<style scoped lang="less">
  @import "~lessPath/sunil/blocks/smallBlocks/search.less";
</style>

