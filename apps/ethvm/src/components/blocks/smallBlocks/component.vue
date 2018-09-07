<template>
  <v-card color="white">
    <v-layout row>
      <v-flex xs7>
        <v-card-title>{{title}}</v-card-title>
        <v-card-text>{{value}}</v-card-text>
      </v-flex>
      <v-flex xs5>
          <v-icon>{{icon}}</v-icon>
      </v-flex>
    </v-layout>
  </v-card>
  <!--
        <div id="component" v-bind:class="backgroundColor">
          <p class="block-title"></p>
          <div class="small-bottom-block">
              <p class="small-block-value"</p>
          </div>
        </div> -->
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BlockComponent',
  props: ['title', 'value', 'icon', 'iconColor', 'backgroundColor'],
  data() {
    return {}
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/smallBlocks/component.less';
</style>
