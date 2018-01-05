<template>
  <div id="MenusSide" class="menus-side">
    <ul>
        <li class="selected"><a href="/"><p>Home</p></a></li>
        <li><a href="/"><p>Blocks</p></a></li>
        <li><a href="/"><p>Transactions</p></a></li>
        <li>
          <a href="/"><p>Charts & Stats</p></a>
          <ul>
            <li><a href="/"><p>Blocks</p></a></li>
            <li><a href="/"><p>Transactions</p></a></li>
          </ul>
        </li>
        <li><a href="/about"><p>About</p></a></li>
        <li class="hidden"><a href="/contact"><p>Contact</p></a></li>
        <li class="hidden"><a href="/faq"><p>FAQ</p></a></li>
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


