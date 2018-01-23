<template>
  <div class="top-10-senders" :class="frompage">  
    <p class="block-title">Top 10 Senders</p>
    <div class="people-list-table">
      <li class="ranking">1</li>
      <li class="info">
        <p class="address">0x829bd824b01630x829bd824b016326a401d083b33d092293333a83026a401d083b33d092293333a830</p>
        <p class="sent">Sent: <span>16.7</span></p>
      </li>
    </div>
    <div class="people-list-table">
      <li class="ranking">2</li>
      <li class="info">
        <p class="address">0x829bd824b01630x829bd824b016326a401d083b33d092293333a83026a401d083b33d092293333a830</p>
        <p class="sent">Sent: <span>16.7</span></p>
      </li>
    </div>
    <div class="people-list-table">
      <li class="ranking">3</li>
      <li class="info">
        <p class="address">0x829bd824b01630x829bd824b016326a401d083b33d092293333a83026a401d083b33d092293333a830</p>
        <p class="sent">Sent: <span>16.7</span></p>
      </li>
    </div>
    <div class="people-list-table">
      <li class="ranking">4</li>
      <li class="info">
        <p class="address">0x829bd824b01630x829bd824b016326a401d083b33d092293333a83026a401d083b33d092293333a830</p>
        <p class="sent">Sent: <span>16.7</span></p>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Top10Senders',
  props: ['frompage'],
  data () {
    return {
      blocks: [],
      showUncles: {}
    }
  },
  methods: {

  },
  beforeMount () {},
  created () {

  },
  beforeDestroy () {

  },
  computed: {

  },
  mounted () {

  }
})
</script>

<style scoped="" lang="less">
  @import "~lessPath/NewHome/Sections/Tables/TablesTop10Senders.less";
</style>
