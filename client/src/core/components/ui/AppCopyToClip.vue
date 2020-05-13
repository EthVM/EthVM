<template>
  <v-btn icon small @click="copy" class="ma-0 "> <v-img :src="require('@/assets/icon-copy.png')" height="20px" max-width="20x" contain/></v-btn>
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
