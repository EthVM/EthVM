<template>
  <div id="MenusSide" class="menus-side">
    <ul>
        <li class="selected"><a href="/"><p>Home</p></a></li>
        <li><p>Blocks</p></li>
        <li><p>Transactions</p></li>
        <li>
          <p>Charts & Stats</p>
          <ul>
            <li><p>Blocks</p></li>
            <li><p>Transactions</p></li>
          </ul>
        </li>
        <li><p>About</p></li>
        <li><p>Contact</p></li>
        <li><p>FAQ</p></li>
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


