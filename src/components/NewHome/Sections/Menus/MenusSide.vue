<template>
  <div id="MenusSide" class="menus-side">

    <ul>
        <li><a href="/"><p v-bind:class="isActive('home')">Home</p></a></li>
        <li><a href="/latestblocks"><p v-bind:class="isActive('latestblocks')">Blocks</p></a></li>
        <li><a href="/lasttransactions"><p v-bind:class="isActive('lasttransactions')">Transactions</p></a></li>
        <li>
          <a href="/charts"><p v-bind:class="isActive('charts')">Charts & Stats</p></a>
          <ul>
            <li><a href="/chartsblocks"><p v-bind:class="isActive('chartsblocks')">Blocks</p></a></li>
            <li><a href="/chartstransactions"><p v-bind:class="isActive('chartstransactions')">Transactions</p></a></li>
          </ul>
        </li>
        <li><a href="/about"><p v-bind:class="isActive('about')">About</p></a></li>
        <li class="hidden"><a href="/contact"><p v-bind:class="isActive('contact')">Contact</p></a></li>
        <li class="hidden"><a href="/faq"><p v-bind:class="isActive('faq')">FAQ</p></a></li>
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
  },
  computed: {
    pageName: function () {
      return this.$route.params.pageName
    }
  },
  methods: {
    isActive: function (param) {
      if (!this.pageName && param === 'home') { return 'selected' }
      if (this.pageName === param) { return 'selected' }
    }
  }
})
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Menus/MenusSide.less";
</style>


