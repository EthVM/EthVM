<template>
    <div>
        <fav-btn-add-to-fav :is-added="isAdded" :add-address="openFavDialog" :tooltip-text="tooltipText"></fav-btn-add-to-fav>
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import { checkAddress, addFavAddress, deleteFavAddress } from './addtoFav.graphql'
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
            },
            result({ data }) {
                console.log(data)
                if (data && data.checkAddress && data.checkAddress.name) {
                    if (data.checkAddress.name !== '') {
                        this.name = data.checkAddress.name
                        this.$emit('addressHasName', this.name)
                    }
                } else {
                    this.name = ''
                    this.$emit('addressHasName', this.name)
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
    name = ''
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
    removeFromFav(): void {
        this.$apollo.mutate({
            mutation: deleteFavAddress,
            client: 'FavClient',
            variables: {
                address: this.address
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
}
</script>
