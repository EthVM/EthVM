<template>
  <!-- .block-container -->
  <div class="block-container row">
    <div class="single-block">
      <div class="col-md-12">
        <div class="block">
          <p class="block-title">Latest Transaction</p>
          <div class="block-table">
            <table>
              <thead>
                <tr>
                  <td>Hash</td>
                  <td>Block</td>
                  <td>Age</td>
                  <td>From</td>
                  <td>To</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>9821749182749128</td>
                  <td>12</td>
                  <td>12</td>
                  <td>Someone you know</td>
                  <td>Someone you know</td>
                  <td>$3000</td>
                </tr>
                <tr>
                  <td>9821749182749128</td>
                  <td>12</td>
                  <td>12</td>
                  <td>Someone you know</td>
                  <td>Someone you know</td>
                  <td>$3000</td>
                </tr>
                <tr>
                  <td>9821749182749128</td>
                  <td>12</td>
                  <td>12</td>
                  <td>Someone you know</td>
                  <td>Someone you know</td>
                  <td>$3000</td>
                </tr>
                <tr>
                  <td>9821749182749128</td>
                  <td>12</td>
                  <td>12</td>
                  <td>Someone you know</td>
                  <td>Someone you know</td>
                  <td>$3000</td>
                </tr>
                <tr>
                  <td>9821749182749128</td>
                  <td>12</td>
                  <td>12</td>
                  <td>Someone you know</td>
                  <td>Someone you know</td>
                  <td>$3000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- .block -->
      </div>
    </div>
    <!-- .single-block -->
  </div>
  <!-- .block-container -->
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'block-container'
  })
</script>

<style lang='less'>
  @import "~lessPath/frontpage.less";
</style>