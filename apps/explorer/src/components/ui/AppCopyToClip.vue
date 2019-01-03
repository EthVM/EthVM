<template>
  <v-btn icon> <v-icon class="fa fa-copy secondary--text" v-on:click="copyToClip(valueToCopy)"></v-icon> </v-btn>
</template>

<script lang="ts">
import copyClip from 'clipboard-copy'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppCopyToClip extends Vue {
  @Prop(String) valueToCopy: string

  copyToClip(newVar) {
    const status = copyClip(newVar)
  }
}
</script>
