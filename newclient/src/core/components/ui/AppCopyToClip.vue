<template>
    <v-btn icon small class="ma-0" @click="copy"> <v-img :src="require('@/assets/icon-copy.png')" height="20px" max-width="20x" contain /></v-btn>
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
    /**
     * Copies string to clipboard
     */
    copy(): void {
        const status = clipboardCopy(this.valueToCopy)
    }
}
</script>
