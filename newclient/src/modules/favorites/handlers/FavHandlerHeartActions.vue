<template>
    <div>
        <!--
        =====================================================================================
          Button
        =====================================================================================
        -->
        <fav-btn-heart :is-added="isAdded" :add-address="openFavDialog" :tooltip-text="tooltipText" />
        <!--
        =====================================================================================
          Dialog
        =====================================================================================
        -->
        <v-dialog v-model="open" max-width="500">
            <fav-dialog v-if="!isAdded" :address="address" :add="true" :chips="addrChips" :dialog-method="addToFav" @closeFavDialog="closeFavDialog()" />
            <fav-dialog
                v-else
                :address="address"
                :addr-name="name"
                :add="false"
                :chips="addrChips"
                :dialog-method="removeFromFav"
                @closeFavDialog="closeFavDialog()"
            />
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { checkAddress } from './checkAdr.graphql'
import FavBtnHeart from '@app/modules/favorites/components/FavBtnHeart.vue'
import FavDialog from '@app/modules/favorites/components/FavDialog.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { FavActions as FavActionsMixin } from '@app/modules/favorites/mixins/FavActions.mixin'
import { ErrorMessagesFav } from '@app/modules/favorites/models/ErrorMessagesFav'

@Component({
    components: {
        FavBtnHeart,
        FavDialog
    },
    apollo: {
        checkAddress: {
            query: checkAddress,
            client: 'FavClient',
            fetchPolicy: 'cache-and-network',
            variables() {
                return {
                    address: this.address
                }
            },
            result({ data }) {
                if (data && data.checkAddress && data.checkAddress.name) {
                    if (data.checkAddress.name !== '') {
                        this.name = data.checkAddress.name
                        this.$emit('addressHasName', this.name)
                        this.emitErrorState(false)
                    }
                } else {
                    this.name = ''
                    this.$emit('addressHasName', this.name)
                    this.emitErrorState(false)
                }
            },
            error(error) {
                this.emitErrorState(true, ErrorMessagesFav.addressCheck)
            }
        }
    }
})
export default class FavHandlerHeartActions extends Mixins(FavActionsMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(String) address!: string
    @Prop(Array) addrChips!: EnumAdrChips[]
    /*
    ===================================================================================
      Data
    ===================================================================================
    */
    checkAddress!: boolean
    open = false
    name = ''
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    addToFav(name: string): void {
        this.mixinAddToFav(name, this.address).then(res => {
            if (res) {
                this.$apollo.queries.checkAddress.refresh()
            }
        })
        this.closeFavDialog()
    }
    removeFromFav(): void {
        this.mixinRemoveFromFav(this.address).then(res => {
            if (res) {
                this.$apollo.queries.checkAddress.refresh()
            }
        })
        this.closeFavDialog()
    }
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get tooltipText(): string {
        return this.isAdded ? this.$t('fav.tooltip.remove').toString() : this.$t('fav.tooltip.add').toString()
    }

    get isAdded(): boolean {
        return this.checkAddress !== undefined && this.checkAddress !== null
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    closeFavDialog(): void {
        this.open = false
    }
    openFavDialog(): void {
        this.open = true
    }
    emitErrorState(val: boolean, message: string): void {
        this.$emit('errorFavorites', val, message)
    }
}
</script>
