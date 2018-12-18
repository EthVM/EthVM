<template>
  <v-card
    :color="getColor"
    :class="getBack"
    flat
    class="mt-1 pr-1"
    height="150px"
    style="padding-top: 42px; padding-left: 24px;"
  >
    <v-layout wrap>
      <v-flex xs12>
        <v-layout row wrap align-end>
          <v-card-title class="display-1 font-weight-medium pb-0 pl-1 pb-0">{{ value }}</v-card-title>
          <v-card-title v-if="metrics" class="headline pl-0 pb-0">{{ metrics }}</v-card-title>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-card-text class="text-uppercase pt-1 pl-0">{{ title }}</v-card-text>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppInfoCard',
  props: ['title', 'value', 'colorType', 'metrics', 'backType'],
  data() {
    return {}
  },
  computed: {
    getColor(): string {
      return this.colorType
    },
    getBack(): string {
      return this.backType
    }
  }
})
</script>
