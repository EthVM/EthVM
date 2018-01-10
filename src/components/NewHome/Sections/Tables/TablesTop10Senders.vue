<template>
<div class="top-10-senders" :class="frompage">
  
  <p class="block-title">Top 10 Senders</p>

  <div class="people-list-table">
    
    <table>
      <tbody>
        <tr>
          <td>1.</td>
          <td>
            <p>0x829bd824b016326a401d083b33d092293333a830</p>
            <h5>Sent: <span>16.7</span></h5>
          </td>
        </tr>
        <tr>
          <td>10.</td>
          <td>
            <p>0x829bd824b016326a401d083b33d092293333a830</p>
            <h5>Sent: <span>16.7</span></h5>
          </td>
        </tr>
        <tr>
          <td>10.</td>
          <td>
            <p>0x829bd824b016326a401d083b33d092293333a830</p>
            <h5>Sent: <span>16.7</span></h5>
          </td>
        </tr>
        <tr>
          <td>10.</td>
          <td>
            <p>0x829bd824b016326a401d083b33d092293333a830</p>
            <h5>Sent: <span>16.7</span></h5>
          </td>
        </tr>
        <tr>
          <td>10.</td>
          <td>
            <p>0x829bd824b016326a401d083b33d092293333a830</p>
            <h5>Sent: <span>16.7</span></h5>
          </td>
        </tr>
      </tbody>
    </table>

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
