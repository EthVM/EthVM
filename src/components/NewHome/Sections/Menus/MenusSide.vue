<template>
  <div id="MenusSide" class="menus-side">
    <ul>
        <li>Home</li>
        <li>Blocks</li>
        <li>Transactions</li>
        <li>Charts & Stats</li>
        <li>About</li>
        <li>Contact</li>
        <li>FAQ</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MenusSide',
  data () {
    return {

    }
  }
})
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Menus/MenusSide.less";
</style>


