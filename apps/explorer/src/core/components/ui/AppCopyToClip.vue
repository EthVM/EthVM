<template>
  <v-btn icon @click="copy" class="ma-0"> <v-icon class="fa fa-copy secondary--text" /> </v-btn>
</template>

<script lang="ts">
import clipboardCopy from 'clipboard-copy'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppCopyToClip extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) valueToCopy!: string

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  copy(): void {
    const status = clipboardCopy(this.valueToCopy)
  }
}
</script>
