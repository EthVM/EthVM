<template>
    <div>
        <v-tooltip top color="white" content-class="tooltip-border">
            <template #activator="{on}">
                <div v-on="on">
                    <v-btn v-if="!deleteMode" outline flat small color="error" class="text-capitalize ma-0" @click.stop="removeAddress()">
                        <v-icon class="fas fa-trash-alt pr-2 icon-small" />{{ $t('fav.btn.remove') }}</v-btn
                    >
                    <v-btn v-else :disabled="disabled" depressed small color="error" class="text-capitalize ma-0" @click.stop="removeAddress()">
                        <v-icon class="fas fa-trash-alt pr-2 icon-small" />{{ $t('fav.btn.remove') }}</v-btn
                    >
                </div>
            </template>
            <span class="black--text">{{ tooltipText }}</span>
        </v-tooltip>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FavBtnRemove extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Function) removeAddress!: void
    @Prop(Boolean) deleteMode!: boolean
    @Prop(Array) deleteArray!: string[]
    /*
    ===================================================================================
    Computed
    ===================================================================================
    */
    get disabled(): boolean {
        return this.deleteArray.length === 0
    }
    get tooltipText(): string {
        return this.deleteMode ? this.$t('fav.tooltip.remove-select').toString() : this.$t('fav.tooltip.remove').toString()
    }
}
</script>
<style scoped lang="css">
.icon-small {
    font-size: 12px;
}
</style>
