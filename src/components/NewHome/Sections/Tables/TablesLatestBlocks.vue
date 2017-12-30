<template>
  <div id="TablesLatestBlocks" class="latest-blocks">

    <p class="block-title">Latest Blocks</p>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <td>Hash</td>
            <td>Miner</td>
            <td>-</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>324f0j9g0453g9h3g9h34f340g3j04gf9j34</td>
            <td>23jkrf2kjf43423</td>
            <td></td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'block-container',
  data () {
    return {

    }
  }
})
</script>

<style scoped lang='less'>
  @import "~lessPath/NewHome/Sections/Tables/TablesLatestBlocks.less";
</style>
