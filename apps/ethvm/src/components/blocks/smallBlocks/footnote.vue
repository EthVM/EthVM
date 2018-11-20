<template>
<v-card flat color="transparent">
  <v-layout row>
    <v-card-text  v-for="i in footnotes" :key="i.text" class="pa-0">
      <v-layout row align-center>
        <v-flex xs1>
          <v-icon small :color="getColor(i)">{{i.icon}}</v-icon>
        </v-flex>
        <v-flex xs11>
          <v-card-text class="pl-1 caption">{{i.text}}</v-card-text>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-layout>
</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
/* Footnote arrya example:
  footnotes: [
    {
      color: 'primary',
      text: 'some text',
      icon: 'fa fa-clock'
    }
  ] */

export default Vue.extend({
  name: 'BlockComponent',
  props: ['footnotes'],
  data() {
    return {}
  },
  methods: {
    getColor(note): string {
      return note.color
    }
  }
})
</script>
