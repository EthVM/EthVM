<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{on}">
            <v-btn :small="isSmall" icon fab class="ma-0" @click.stop="btnClick()" v-on="on">
                <v-img :src="iconImage" :max-height="btnHeight" :max-width="btnWidth" contain
            /></v-btn>
        </template>
        <span class="black--text">{{ tooltipText }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppBtnHeart extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Boolean) isAdded!: boolean
    @Prop(Function) btnClick!: void
    @Prop(String) tooltipText!: string
    @Prop({ type: Boolean, default: false }) isSmall!: boolean

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get iconImage(): string {
        return this.isAdded ? require('@/assets/icon-heart.png') : require('@/assets/icon-heart-outline.png')
    }
    get btnHeight(): string {
        return this.isSmall ? '30px' : '48px'
    }
    get btnWidth(): string {
        return this.isSmall ? '30px' : '48px'
    }
}
</script>
