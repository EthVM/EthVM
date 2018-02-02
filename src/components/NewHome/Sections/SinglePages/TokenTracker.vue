<template>
<div class="token-tracker">
  <div class="block-container">
    <div class="section-block-container">
      <p class="block-title">Token Tracker</p>
      <div class="section-block">
        <table>
          <tr v-for="token in account.tokens">
            <td>{{token.symbol}}</td>
            <td>{{token.balance.toFixed()}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- .section-block-container -->
  </div>
  <!-- .block-container -->
</div>

</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'TokenTracker',
  props: [
    'account'
  ],
  data() {
    return {

    }
  },
  created() {},
  methods: { }

})

</script>

<style scoped="" lang="less">
@import '~lessPath/NewHome/Sections/SinglePages/TokenTracker';
</style>
