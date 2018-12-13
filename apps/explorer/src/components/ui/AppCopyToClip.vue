<template>
  <v-btn icon>
    <v-icon class="fa fa-copy secondary--text" v-on:click="copyToClip(valueToCopy)"></v-icon>
  </v-btn>
</template>

<script lang="ts">
import copyClip from 'clipboard-copy'
import Vue from 'vue'

export default Vue.extend({
  name: 'AppCopyToClip',
  props: {
    valueToCopy: String
  },
  data() {
    return {}
  },
  methods: {
    copyToClip(newVar) {
      const status = copyClip(newVar)
    }
  }
})
</script>
