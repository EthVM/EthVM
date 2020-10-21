<template>
    <div v-if="isAdded">
        <!--
        =====================================================================================
          Edit
        =====================================================================================
        -->
        <fav-btn-edit :edit-address="openEditDialog" />
        <!--
        =====================================================================================
          Dialog
        =====================================================================================
        -->
        <v-dialog v-model="open" max-width="500">
            <fav-dialog
                v-if="open"
                :chips="addrChips"
                :dialog-method="editName"
                :dialog-mode="editMode"
                :addrs="dialogAddrs"
                @closeFavDialog="closeEditDialog()"
            />
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { checkAddress } from './checkAdr.graphql'
import { editFavAddress } from './editAdr.graphql'
import FavBtnEdit from '@app/modules/favorites/components/FavBtnEdit.vue'
import FavDialog from '@app/modules/favorites/components/FavDialog.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { ErrorMessagesFav } from '@app/modules/favorites/models/ErrorMessagesFav'
import { FavDialogModes, DialogAddress } from '@app/modules/favorites/models/FavDialog'
@Component({
    components: {
        FavBtnEdit,
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
export default class FavHandlerEdit extends Vue {
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
    name = ''
    open = false
    editMode = FavDialogModes.edit

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    editName(name: string): void {
        this.$apollo
            .mutate({
                mutation: editFavAddress,
                client: 'FavClient',
                variables: {
                    address: this.address,
                    name: name
                }
            })
            .then(data => {
                if (data) {
                    this.$emit('nameChange', name)
                    this.closeEditDialog()
                    this.$apollo.queries.checkAddress.refresh()
                }
            })
    }

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get isAdded(): boolean {
        return this.checkAddress !== undefined && this.checkAddress !== null
    }
    get dialogAddrs(): DialogAddress[] {
        return [new DialogAddress(this.address, this.name, this.addrChips)]
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    closeEditDialog(): void {
        this.open = false
    }
    openEditDialog(): void {
        this.open = true
    }
    emitErrorState(val: boolean, message: string): void {
        this.$emit('errorFavorites', val, message)
    }
}
</script>
