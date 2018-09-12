<template>
  <v-card :color="getColor" class="mr-2 ml-2 mt-1">
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
  props: ['title', 'value', 'icon', 'colorType'],
  data() {
    return {}
  },
  computed: {
    getColor(): string {
      return this.colorType
    }
  }
})
</script>
