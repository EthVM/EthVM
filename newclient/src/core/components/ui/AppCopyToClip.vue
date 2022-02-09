<template>
    <div>
        <app-btn-icon v-if="isCustom" icon="far fa-copy" :tooltip-text="tooltipText" :color="color" @click="copy" />
        <v-btn v-else icon small class="ma-0" @click="copy"> <v-img :src="require('@/assets/icon-copy.png')" height="20px" max-width="20x" contain /></v-btn>
        <v-snackbar v-model="showCopyMes" bottom right :color="mesColor" :absolute="isCustom" class="break-string" :timeout="2000">
            {{ message }}
            <v-btn color="white" flat icon my-1 @click="showCopyMes = false">
                <v-icon class="fas fa-times" small />
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import clipboardCopy from 'clipboard-copy'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppBtnIcon from './AppBtnIcon.vue'
@Component({
    components: {
        AppBtnIcon
    }
})
export default class AppCopyToClip extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(String) valueToCopy!: string
    @Prop({ type: Boolean, default: false }) isCustom
    @Prop(String) tooltipText!: string
    @Prop({ type: String, default: '' }) color!: string
    @Prop({ type: String, default: '' }) customMessage!: string
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
            this.message = this.customMessage === '' ? `${this.$t('copied')}: ${this.valueToCopy}` : `${this.customMessage}`
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
