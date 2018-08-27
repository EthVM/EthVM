<template>
  <div id="mobile-menu" class="mobile-menu">
    <div v-if="!getActive">
      <i class="fa fa-bars" aria-hidden="true" v-on:click="setActive()"></i>
    </div>
    <div v-else class="show-menu">
      <div class="row1">
        <img src="~@/assets/logo-white.png">
        <i class="fa fa-times" aria-hidden="true" v-on:click="setActive()"></i>
      </div>
      <div class="mobile-search-block">
        <block-search></block-search>
      </div>
      <ul>
        <li v-bind:class="{ 'selected' : pagename == undefined }">
          <a href="/">
            <div class="icon"></div><span>{{ $t('title.home') }}</span></a>
        </li>
        <li v-bind:class="{ 'selected' : pagename == 'blocks' }">
          <a href="/blocks">
            <div class="icon"></div><span>{{ $t('title.blocks') }}</span></a>
        </li>
        <li v-bind:class="{ 'selected' : pagename == 'transactions' }">
          <a href="/transactions">
            <div class="icon"></div><span>{{ $t('title.tx') }}</span></a>
        </li>
        <li v-bind:class="{ 'selected' : pagename == 'pending' }">
          <a href="/pending">
            <div class="icon"></div><span>{{ $t('title.pending') }}</span></a>
        </li>
        <li v-bind:class="{ 'selected' : pagename == 'charts' }">
          <a href="/charts">
            <div class="icon"></div><span>{{ $t('title.charts') }}</span></a>
        </li>
        <li v-bind:class="{ 'selected' : pagename == 'about' }">
          <a href="/about">
            <div class="icon"></div><span>{{ $t('title.about') }}</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    data() {
      return {
        active: false
      }
    },
    props: ['pagename'],
    methods: {
      setActive() {
        this.active = (!this.active) ? true : false
      },
     },
     computed: {
        getActive(): boolean {
          return this.active
      }
    }
  })
</script>

<style scoped lang="less">
  @import '~lessPath/sunil/blocks/header/mobileMenu.less';
</style>
