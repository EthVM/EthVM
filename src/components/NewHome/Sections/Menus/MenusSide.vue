<template>
  <div id="MenusSide" class="menus-side">

    <ul v-on:click="$emit('mobileMenuClicked')">
        <li><router-link to="/"><p v-bind:class="isActive('home')">Home</p></router-link></li>
        <li><router-link to="/latestblocks"><p v-bind:class="isActive('latestblocks')">Blocks</p></router-link></li>
        <li><router-link to="/lasttransactions"><p v-bind:class="isActive('lasttransactions')">Transactions</p></router-link></li>
        <li><router-link to="/pendingTransactions"><p v-bind:class="isActive('pendingTransactions')">Pending Transactions</p></router-link></li>
        <li>
          <router-link to="/charts"><p v-bind:class="isActive('charts')">Charts & Stats</p></router-link>
          <ul>
            <li><router-link to="/chartsblocks"><p v-bind:class="isActive('chartsblocks')">Blocks</p></router-link></li>
            <li><router-link to="/chartstransactions"><p v-bind:class="isActive('chartstransactions')">Transactions</p></router-link></li>
          </ul>
        </li>
        <li><router-link to="/about"><p v-bind:class="isActive('about')">About</p></router-link></li>
        <li class="hidden"><router-link to="/contact"><p v-bind:class="isActive('contact')">Contact</p></router-link></li>
        <li class="hidden"><router-link to="/faq"><p v-bind:class="isActive('faq')">FAQ</p></router-link></li>
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


