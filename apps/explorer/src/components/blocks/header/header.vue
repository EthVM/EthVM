<template>
  <div id="menu-top" class="navbar navbar-default navbar-fixed-top">
    <div class="container menu-container">
      <div class="logo">
        <router-link to="/"><img src="~@/assets/logo.png"/></router-link>
      </div>
      <nav class="main-menu">
        <ul>
          <li v-bind:class="{ selected: pagename == undefined }">
            <a href="/"
              ><div class="icon"></div>
              <span>{{ $t('title.home') }}</span></a
            >
          </li>
          <li v-bind:class="{ selected: pagename == 'blocks' }">
            <a href="/blocks"
              ><div class="icon"></div>
              <span>{{ $t('title.blocks') }}</span></a
            >
          </li>
          <li v-bind:class="{ selected: pagename == 'transactions' }">
            <a href="/transactions"
              ><div class="icon"></div>
              <span>{{ $t('title.tx') }}</span></a
            >
          </li>
          <li v-bind:class="{ selected: pagename == 'pending' }">
            <a href="/pending"
              ><div class="icon"></div>
              <span>{{ $t('title.pending') }}</span></a
            >
          </li>
          <li v-bind:class="{ selected: pagename == 'charts' }">
            <a href="/charts"
              ><div class="icon"></div>
              <span>{{ $t('title.charts') }}</span></a
            >
          </li>
          <li v-bind:class="{ selected: pagename == 'about' }">
            <a href="/about"
              ><div class="icon"></div>
              <span>{{ $t('title.about') }}</span></a
            >
          </li>
        </ul>
      </nav>
      <mobile-menu></mobile-menu>
      <!-- Select language will go here -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      isHidden: true
    }
  },
  props: ['pagename'],
  methods: {
    mobileShowMenuClick() {
      const el = document.getElementById('main-menu')
      el.classList.remove('mobile-menu-hidden')
    },
    mobileHideMenuClick() {
      // this.isHidden = !this.isHidden;

      const el = document.getElementById('main-menu')
      el.classList.add('mobile-menu-hidden')
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/header/header.less';
</style>
