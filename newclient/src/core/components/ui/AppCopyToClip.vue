<template>
    <div>
        <v-btn icon small class="ma-0" @click="copy"> <v-img :src="require('@/assets/icon-copy.png')" height="20px" max-width="20x" contain /></v-btn>
        <v-snackbar v-model="showCopyMes" bottom right :color="mesColor" multi-line class="break-string" timeout="3000">
            {{ message }}
            <v-btn color="white" flat @click="showCopyMes = false" icon my-1>
                <v-icon class="fas fa-times" small />
            </v-btn>
        </v-snackbar>
    </div>
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
    Data
  ===================================================================================
  */

    showCopyMes = false
    message: any = ''
    mesColor = 'primary'

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Copies string to clipboard
     */
    async copy(): Promise<void> {
        this.message = ''
        try {
            await clipboardCopy(this.valueToCopy)
            this.message = `${this.$t('copied')}: ${this.valueToCopy}`
            this.mesColor = 'primary'
        } catch (err) {
            this.message = err
            this.mesColor = 'error'
        }
        this.showCopyMes = true
    }
}
</script>
<style>
.break-string {
    word-break: break-all;
}
</style>
