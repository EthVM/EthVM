<template>
    <div>
        <!--
        =====================================================================================
          Button
        =====================================================================================
        -->
        <app-btn-heart :is-added="isAdded" :btn-click="openFavDialog" :tooltip-text="tooltipText" :is-small="isSmall" />

        <!--
        =====================================================================================
          Dialog
        =====================================================================================
        -->
        <v-dialog v-model="open" max-width="500">
            <fav-dialog
                :chips="addrChips"
                :dialog-method="(mode === FavDialogModes.add ? addToFav : removeFromFav)"
                :dialog-mode="mode"
                :addrs="dialogAddrs"
                @closeFavDialog="closeFavDialog()"
            />
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { checkAddress as checkAddressQuery } from './checkAdr.graphql'
import AppBtnHeart from '@app/core/components/ui/AppBtnHeart.vue'
import FavDialog from '@app/modules/favorite-addresses/components/FavDialog.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { FavActions as FavActionsMixin } from '@app/modules/favorite-addresses/mixins/FavActions.mixin'
import { ErrorMessagesFav } from '@app/modules/favorite-addresses/models/ErrorMessagesFav'
import { FavDialogModes, DialogAddress } from '@app/modules/favorite-addresses/models/FavDialog'
import { DataArray } from '@app/apollo/favorite-addresses/models'
import { CheckAddressRefetch } from '@app/modules/favorite-addresses/models/FavApolloRefetch'

@Component({
    components: {
        AppBtnHeart,
        FavDialog
    },
    apollo: {
        checkAddress: {
            query: checkAddressQuery,
            client: 'FavAddrClient',
            fetchPolicy: 'network-only',
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
    @Prop({ type: Boolean, default: false }) isSmall!: boolean

    /*
    ===================================================================================
      Data
    ===================================================================================
    */
    checkAddress!: boolean
    open = false
    name = ''
    FavDialogModes = FavDialogModes
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    addToFav(name: string): void {
        this.mixinAddToFav(name, this.address, this.refetchCheckAddress)
        this.closeFavDialog()
    }
    removeFromFav(): void {
        this.mixinRemoveFromFav(this.address, this.refetchCheckAddress)
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

    get mode(): FavDialogModes {
        return this.isAdded ? FavDialogModes.remove : FavDialogModes.add
    }
    get dialogAddrs(): DialogAddress[] {
        return [new DialogAddress(this.address, this.name, this.addrChips)]
    }

    get refetchCheckAddress(): CheckAddressRefetch[] {
        return [
            {
                query: checkAddressQuery,
                variables: {
                    address: this.address
                }
            }
        ]
    }

    /*
    ===================================================================================
      Lifecycle:
    ===================================================================================
    */
    mounted() {
        window.addEventListener('storage', event => {
            if (event.key === DataArray.addr) {
                this.$apollo.queries.checkAddress.refresh()
            }
        })
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
