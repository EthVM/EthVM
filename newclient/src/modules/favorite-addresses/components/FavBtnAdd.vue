<template>
    <div>
        <v-tooltip top color="white" content-class="tooltip-border">
            <template #activator="{on}">
                <v-btn small depressed color="secondary" class="text-capitalize ma-0 py-0 px-1 btn-width" @click.stop="openDialog()" v-on="on">
                    <v-icon class="fas fa-plus pr-2 icon-small" />{{ $t('fav.btn.add') }}</v-btn
                >
            </template>
            <span class="black--text">{{ $t('fav.tooltip.add') }}</span>
        </v-tooltip>
        <v-dialog v-model="open" max-width="500">
            <fav-dialog v-if="open" :has-address="hasAddress" :dialog-method="addAddress" :dialog-mode="searchMode" @closeFavDialog="closeFavDialog()" />
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
export default class FavBtnAdd extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Function) addAddress!: void
    @Prop(Function) hasAddress!: void

    /*
    ===================================================================================
      Data
    ===================================================================================
    */
    open = false
    searchMode = FavDialogModes.searchAdd

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
.v-btn {
    min-width: 65px !important;
}
</style>
