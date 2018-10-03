<template>
  <v-card :color="getColor" class="mt-1 elevation-5">
    <v-card-title class="display-1 pb-1 font-weight-medium">{{value}}</v-card-title>
    <v-card-text class="subheading pt-0 pb-0">{{title}}</v-card-text>
    <v-card-text class="text-xs-right pt-0 pb-1">
      <v-icon size="50px">{{icon}}</v-icon>
    </v-card-text>
  </v-card>
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
