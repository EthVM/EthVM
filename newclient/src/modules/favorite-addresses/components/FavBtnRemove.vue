<template>
    <div>
        <v-tooltip top color="white" content-class="tooltip-border">
            <template #activator="{on}">
                <div v-on="on">
                    <v-btn v-if="!deleteMode" outline flat small color="error" class="text-capitalize ma-0" @click.stop="startDeleteMode()">
                        <v-icon class="fas fa-trash-alt pr-2 icon-small" />{{ $t('fav.btn.remove') }}</v-btn
                    >
                    <v-btn v-else :disabled="disabled" depressed small color="error" class="text-capitalize ma-0" @click.stop="openDialog()">
                        <v-icon class="fas fa-trash-alt pr-2 icon-small" />{{ $t('fav.btn.remove') }}</v-btn
                    >
                </div>
            </template>
            <span class="black--text">{{ tooltipText }}</span>
        </v-tooltip>
        <v-dialog v-model="open" max-width="500">
            <fav-dialog v-if="open" :dialog-method="deleteMethod" :dialog-mode="removeMode" :addrs="deleteArray" @closeFavDialog="closeFavDialog()" />
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import FavDialog from '@app/modules/favorite-addresses/components/FavDialog.vue'
import { FavDialogModes, DialogAddress } from '@app/modules/favorite-addresses/models/FavDialog'

@Component({
    components: {
        FavDialog
    }
})
export default class FavBtnRemove extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Function) startDeleteMode!: void
    @Prop(Boolean) deleteMode!: boolean
    @Prop(Array) deleteArray!: DialogAddress[]
    @Prop(Function) deleteMethod!: void

    /*
    ===================================================================================
      Data
    ===================================================================================
    */
    open = false
    removeMode = FavDialogModes.remove
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

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    openDialog(): void {
        this.open = true
    }
    closeFavDialog(): void {
        this.open = false
    }
}
</script>
<style scoped lang="css">
.icon-small {
    font-size: 12px;
}
</style>
