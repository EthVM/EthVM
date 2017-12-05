<template>

  <div class="topnav">


    <div ref="mobileMenuOpen" v-on:click="toggleMenu();" class="mobile-menu">
      <icon class="mobile-menu-open" name='bars' scale='1.7'></icon>
    </div>

    <div ref="mobileMenuClose" v-on:click="toggleMenu();" class="mobile-menu hidden">
      <icon class="mobile-menu-open" name='times' scale='1.7'></icon>
    </div>

    <nav ref="topNav">
      <ul>
        <li>About</li>
        <li>Contact</li>
        <li>FAQ</li>
      </ul>
    </nav>
    

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../states'
export default Vue.extend({
  name: 'TopNav',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      store: store
    }
  },
  methods: {
    toggleMenu: function () {
      this.$refs.topNav.className = this.$refs.topNav.classList.contains('nav-show') ? '' : 'nav-show'
      this.$refs.mobileMenuOpen.classList.toggle('hidden')
      this.$refs.mobileMenuClose.classList.toggle('hidden')
    }
  }

})
</script>

<style scoped lang="less">
@import "~lessPath/topnav.less";
</style>
