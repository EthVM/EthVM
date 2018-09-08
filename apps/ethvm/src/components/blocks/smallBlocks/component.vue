<template>
  <v-card color="blue darken-4 white--text">
    <v-card-title class="headline pb-1 font-weight-medium">{{value}}</v-card-title>
    <v-card-text class="caption pt-0 pb-0">{{title}}</v-card-text>
    <v-card-text class="text-xs-right pt-0 pb-1">
      <v-icon size="50px">{{icon}}</v-icon>
    </v-card-text>
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
  props: ['title', 'value', 'icon', 'backgroundColor'],
  data() {
    return {
      colors: 'primary'
    }
  }
})
</script>
