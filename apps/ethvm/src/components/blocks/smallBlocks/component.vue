<template>

  <v-card :color="getColor" flat class="mt-1 pr-1" height="150px" style="padding-left: 24px; padding-top: 42px;">
    <v-card-media>
      <v-img :src="im" aspect-ratio="1">
    </v-img></v-card-media>
    <v-card-title class="display-1 font-weight-medium pb-1 pl-0 pt-0">{{value}} <v-card-title v-if="metrics" class="headline pl-2 pb-2 ">{{metrics}}</v-card-title></v-card-title>
    <v-card-text class="text-uppercase pt-0 pl-0">{{title}}</v-card-text>
    <!-- <v-card-text class="text-xs-right pt-0 pb-1">
      <v-icon size="50px">{{icon}}</v-icon>
    </v-card-text> -->

  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BlockComponent',
  props: ['title', 'value', 'colorType', 'metrics'],
  data() {
    return {
      im: '@/assets/smallblocks/cubes-in-stack-with-shadow.png'
    }
  },
  computed: {
    getColor(): string {
      return this.colorType
    }
  }
})
</script>
