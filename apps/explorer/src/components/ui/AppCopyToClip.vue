<template>
  <v-btn icon> <v-icon class="fa fa-copy secondary--text" v-on:click="copyToClip(valueToCopy)"></v-icon> </v-btn>
</template>

<script lang="ts">
import copyClip from 'clipboard-copy'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  props: {
    valueToCopy: String
  }
})
export default class AppCopyToClip extends Vue {
  copyToClip(newVar) {
    const status = copyClip(newVar)
  }
}
</script>
