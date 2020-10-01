<template>
    <div>
        <fav-btn-add-to-fav :is-added="checkAddress" :add-address="openFavDialog" :tooltip-text="tooltipText"></fav-btn-add-to-fav>
        <v-dialog v-model="open" max-width="500">
            <fav-dialog :address="address" :add="add" :chips="addrChips" :dialog-method="addToFav" @closeFavDialog="closeFavDialog()" />
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { checkAddress, addFavAddress } from './addtoFav.graphql'
import FavBtnAddToFav from '@app/modules/favorites/components/FavBtnAddToFav.vue'
import FavDialog from '@app/modules/favorites/components/FavDialog.vue'
import { EnumAdrChips } from '@app/core/components/props'

@Component({
    components: {
        FavBtnAddToFav,
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
            }
        }
    }
})
export default class FavHandlerLike extends Vue {
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
    add = true
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    addToFav(name: string): void {
        this.$apollo.mutate({
            mutation: addFavAddress,
            client: 'FavClient',
            variables: {
                address: this.address,
                name: name
            }
        })
        this.$apollo.queries.checkAddress.refresh()
        this.closeFavDialog()
    }
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get tooltipText(): string {
        return this.checkAddress ? this.$t('fav.tooltip.remove').toString() : this.$t('fav.tooltip.add').toString()
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
}
</script>
