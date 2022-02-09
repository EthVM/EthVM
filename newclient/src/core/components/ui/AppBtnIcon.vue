<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{on}">
            <v-btn :small="isSmall" icon fab class="ma-0" @click.stop="btnClick()" v-on="on">
                <v-icon :small="isSmall" :class="iconColor"> {{ icon }}</v-icon>
            </v-btn>
        </template>
        <span class="black--text">{{ tooltipText }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppBtnIcon extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(String) tooltipText!: string
    @Prop({ type: Boolean, default: true }) isSmall!: boolean
    @Prop({ type: String, default: '' }) icon!: string
    @Prop({ type: String, default: '' }) color!: string

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get size(): string {
        return this.isSmall ? '20px' : '48px'
    }
    btnClick(): void {
        this.$emit('click')
    }
    get iconColor(): string {
        return this.color === '' ? 'primary--text' : `${this.color}--text`
    }
}
</script>
<style lang="scss" scoped>
.v-btn--floating.v-btn--small {
    height: 30px;
    width: 30px;
}
</style>
