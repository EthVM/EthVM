<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="data">
            <v-icon :class="iconClass" dark small v-on="data.on">{{ iconType }}</v-icon>
        </template>
        <span class="black--text">{{ text }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppTooltip extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(String) text!: string
    @Prop({ type: String, default: 'info' }) iconColor!: string
    @Prop({ type: String, default: 'fa fa-question-circle' }) iconType!: string
    @Prop({ type: Boolean, default: false }) spin!: boolean

    /*
  ===================================================================================
   Getters
  ===================================================================================
  */

    get iconClass(): string {
        const _class = this.spin ? '--text fa-pulse' : '--text'
        return `${this.iconColor}${_class} --text`
    }
}
</script>

<style scoped lang="css">
.tooltip-border {
    border: 1px solid #b4bfd2 !important;
    padding: 5px 10px !important;
    opacity: 1 !important;
    box-shadow: none !important;
}
</style>
