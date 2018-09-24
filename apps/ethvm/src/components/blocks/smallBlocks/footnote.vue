<template>
  <v-layout row justify-center>
    <v-card v-for="i in footnotes" flat color="transparent" :key="i.text">
      <v-layout row justify-start align-start fill-height>
        <v-flex xs1>
          <v-icon small :color="getColor(i)">{{i.icon}}</v-icon>
        </v-flex>
        <v-flex xs11>
          <v-card-text class="pt-0 pl-1 caption">{{i.text}}</v-card-text>
        </v-flex>
      </v-layout>
    </v-card>
  </v-layout>
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
