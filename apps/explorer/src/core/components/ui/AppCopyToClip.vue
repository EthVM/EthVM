<template>
  <v-btn icon @click="copy(valueToCopy)"> <v-icon class="fa fa-copy secondary--text" /> </v-btn>
</template>

<script lang="ts">
import clipboardCopy from 'clipboard-copy'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppCopyToClip extends Vue {
  @Prop(String) valueToCopy!: string

  copy(value) {
    const status = clipboardCopy(value)
  }
}
</script>
