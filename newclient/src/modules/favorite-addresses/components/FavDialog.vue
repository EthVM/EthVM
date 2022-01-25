<template>
    <v-card class="fav-add">
        <!--
        =====================================================================================
          TITLE / CLOSE BTN
        =====================================================================================
        -->
        <v-layout :class="containerPadding" grid-list-xs align-center justify-space-between row fill-height pt-2 pb-1>
            <v-card-title class="title font-weight-bold"> {{ title }}</v-card-title>
            <v-btn flat icon color="secondary" @click="closeDialog()"> <v-icon class="fas fa-times" /> </v-btn>
        </v-layout>
        <v-divider class="lineGrey mb-1" />
        <!--
        =====================================================================================
         Are You Sure?: Mode === remove
        =====================================================================================
        -->
        <p v-if="dialogMode === FavDialogModes.remove" :class="[containerPadding, ' pt-2 pb-3 body-2']">
            {{ $tc('fav.dialog.delete-are-you-sure', pluralStrings) }}
        </p>
        <!--
        =====================================================================================
          ADDRESSES NAME/CHIPS/HASH: Mode !=== searchAdd
        =====================================================================================
        -->
        <div v-if="dialogMode !== FavDialogModes.searchAdd" :class="addressContainerClass">
            <v-layout v-for="(adr, index) in addrs" :key="index" grid-list-xs align-center justify-start row wrap fill-height>
                <!--
                =====================================================================================
                  BLOCKIE
                =====================================================================================
                -->
                <v-flex shrink>
                    <v-layout align-center justify-center row fill-height pa-2>
                        <blockies :address="adr.getAddress()" width="36px" height="36px" />
                    </v-layout>
                </v-flex>
                <!--
                =====================================================================================
                  NAME/CHIPS/HASH
                =====================================================================================
                -->
                <v-flex xs8 pl-2>
                    <v-layout v-if="adr.getName() !== undefined || adr.getChips() !== undefined" align-center justify-start row wrap>
                        <v-flex v-if="adr.getName() !== undefined && adr.getName() !== ''" shrink pr-2>
                            <p class="body-2">{{ adr.getName() }}</p>
                        </v-flex>
                        <v-layout v-if="adr.getChips() !== undefined" align-center justify-start row>
                            <v-flex v-for="(chip, idx) in adr.getChips()" :key="idx" shrink>
                                <app-adr-chip :chip="chip" />
                            </v-flex>
                        </v-layout>
                    </v-layout>
                    <app-transform-hash :hash="adr.getAddress() | toChecksum" class="pt-1" />
                </v-flex>
                <v-flex v-if="addrs.length > 1 && index + 1 < addrs.length" xs12>
                    <v-divider class="lineGrey ma-1" />
                </v-flex>
            </v-layout>
        </div>
        <!--
        =====================================================================================
          ADDRESS INPUT: Mode searcAdd
        =====================================================================================
        -->
        <v-layout v-if="dialogMode === FavDialogModes.searchAdd" :class="containerPadding" fill-height align-center justify-center row wrap pt-4>
            <v-flex xs12>
                <v-text-field
                    v-model="newAddress"
                    :label="$t('fav.dialog.enter-address')"
                    :rules="addressRules"
                    outline
                    counter
                    maxlength="42"
                    class="name-input-container address-input"
                >
                    <template #prepend-inner>
                        <div v-if="!isValidAddress" class="blockie-placeholder" />
                        <blockies v-if="isValidAddress" :address="newAddress" width="30px" height="30px" />
                    </template>
                    <template #append>
                        <span v-if="newAddress === ''" class="caption greyPlaceholder--text optional-text">{{ $t('fav.dialog.required') }}</span>
                        <v-btn v-else flat icon small color="secondary" class="ma-0" @click="clearAddr()">
                            <v-icon class="fas fa-times" />
                        </v-btn>
                    </template>
                </v-text-field>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          INPUT - NAME: Mode edit, add, searchAdd
        =====================================================================================
        -->
        <v-layout v-if="dialogMode !== FavDialogModes.remove" :class="containerPadding" fill-height align-center justify-center row wrap pt-2 pb-2>
            <v-flex xs12>
                <v-text-field v-model="name" :rules="nameRules" :label="inputLabel" outline counter maxlength="20" class="name-input-container">
                    <template #append>
                        <span v-if="name === ''" class="caption greyPlaceholder--text optional-text">{{ $t('fav.dialog.optional') }}</span>
                        <v-btn v-else flat icon small color="secondary" class="ma-0" @click="clearName()"> <v-icon class="fas fa-times" /> </v-btn>
                    </template>
                </v-text-field>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          DELETE TEXT: Mode Delete
        =====================================================================================
        -->
        <div v-if="dialogMode === FavDialogModes.remove">
            <v-layout :class="[containerPadding, 'pb-2 pt-2']" row align-start justify-start>
                <v-flex shrink pt-2 pb-2>
                    <p class="info--text">{{ $t('fav.dialog.delete-tip') }}</p>
                </v-flex>
                <v-flex pa-2>
                    <p class="info--text">{{ $tc('fav.dialog.delete-tip-text', pluralStrings) }}</p>
                </v-flex>
            </v-layout>
        </div>
        <!--
        =====================================================================================
         CANCEL/ADD BUTONS
        =====================================================================================
        -->
        <v-layout :class="containerPadding" fill-height align-center justify-end pb-4>
            <v-btn flat color="black" class="text-capitalize mr-3" @click="closeDialog()">
                {{ $t('common.cancel') }}
            </v-btn>
            <v-btn :disabled="disableRightBtn" :color="rightBtnColor" depressed class="text-capitalize ma-0" @click="dialogMethod(value), closeDialog()">
                {{ rightBtnText }}</v-btn
            >
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import VueQr from 'vue-qr'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppAdrChip from '@app/core/components/ui/AppAdrChip.vue'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import Blockies from '@app/modules/address/components/Blockies.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { eth } from '@app/core/helper'
import { FavDialogModes, DialogAddress } from '@app/modules/favorite-addresses/models/FavDialog'

type Rules = (data: string) => void

@Component({
    components: {
        AppAdrChip,
        AppTransformHash,
        Blockies
    }
})
export default class FavAddDialog extends Vue {
    /*
    ===================================================================================
      Props:
    ===================================================================================
    */
    @Prop(String) dialogMode!: FavDialogModes
    @Prop(Array) addrs?: DialogAddress[]
    @Prop(Array) chips?: EnumAdrChips[]
    @Prop(Function) dialogMethod!: void
    @Prop(Function) hasAddress!: (addr) => boolean

    /*
    ===================================================================================
      Data:
    ===================================================================================
    */
    name: string = ''
    newAddress: string = ''
    FavDialogModes = FavDialogModes
    /*
    ===================================================================================
      Computed:
    ===================================================================================
    */

    /**
     * Computed property for the dialogMethod
     * @return:
     * FavDialogModes.add - string
     * FavDialogModes.searchAdd - { name: string, address: string }
     */
    get value(): object | string {
        if (this.dialogMode == FavDialogModes.searchAdd) {
            return { name: this.name, address: this.newAddress }
        }
        return this.name
    }

    /**
     * Computed property for the input name
     * Checks whether name input is less than 20 chars
     * @return Rules[]
     */
    get nameRules(): Rules[] {
        const rules = [name => name.length <= 20 || this.$t('fav.dialog.input-length')]
        return rules
    }

    /**
     * Computed property for the input address
     * Checks whether address is valid and was provided
     * @return Rules[]
     */
    get addressRules(): Rules[] {
        const rules = [
            newAddress => (!!newAddress && newAddress !== '') || this.$t('fav.dialog.input-required'),
            newAddress => this.isValidAddress || this.$t('fav.dialog.invalid-address'),
            newAddress => !this.hasAddress(newAddress) || this.$t('fav.message.already-exists')
        ]
        return rules
    }

    /**
     * Computed property to disable Add Button
     * @return: boolean
     */
    get disableRightBtn(): boolean {
        if (this.dialogMode !== FavDialogModes.searchAdd) {
            return false
        }
        return !this.isValidAddress || !!this.hasAddress(this.newAddress)
    }

    /**
     * Computed property for the dialog title
     * @return: string
     */
    get title(): string {
        switch (this.dialogMode) {
            case FavDialogModes.add:
                return this.$t('fav.dialog.title-add').toString()
            case FavDialogModes.edit:
                return this.$t('fav.dialog.title-edit').toString()
            case FavDialogModes.searchAdd: {
                return this.$t('fav.dialog.add-new').toString()
            }
            case FavDialogModes.remove: {
                return this.$t('fav.dialog.title-delete').toString()
            }
            default: {
                return ''
            }
        }
    }

    /**
     * Computed property for the right button text
     * @return: string
     */
    get rightBtnText(): string {
        if (this.dialogMode === FavDialogModes.edit) {
            return this.$t('fav.btn.change').toString()
        }
        return this.dialogMode == FavDialogModes.remove ? this.$t('fav.btn.delete').toString() : this.$t('fav.btn.add').toString()
    }

    /**
     * Computed property for the right button color
     * default is secondary, error on remove mode
     * @return: string
     */
    get rightBtnColor(): string {
        return this.dialogMode === FavDialogModes.remove ? 'error' : 'secondary'
    }

    /**
     * Computed property for the input label within Name Input component (not present on remove mode)
     * default is label-add, error on edit mode label-edit
     * @return: string
     */
    get inputLabel(): string {
        return this.dialogMode === FavDialogModes.edit ? this.$t('fav.dialog.label-edit').toString() : this.$t('fav.dialog.label-add').toString()
    }

    /**
     *
     * @return: boolean
     */
    get isValidAddress(): boolean {
        return eth.isValidAddress(this.dialogMode === FavDialogModes.searchAdd ? this.newAddress : true)
    }

    get containerPadding(): string {
        if (this.$vuetify.breakpoint.name === 'xs') {
            return 'pl-2 pr-2'
        }
        return 'pl-3 pr-3'
    }
    get pluralStrings(): 1 | 2 {
        return this.addrs && this.addrs.length > 1 ? 2 : 1
    }
    get addressContainerClass(): string {
        const margin = this.$vuetify.breakpoint.name === 'xs' ? 'ml-2 mr-2' : 'ml-3 mr-3'
        return this.addrs && this.addrs.length > 1 ? `address-table ${margin} scroll-y` : `${margin}`
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Computed property for the input label within Name Input component (not present on remove mode)
     * default is label-add, error on edit mode label-edit
     * @return: string
     */
    closeDialog(): void {
        this.clearName()
        this.clearAddr()
        this.$emit('closeFavDialog')
    }
    clearName(): void {
        this.name = ''
    }
    clearAddr(): void {
        this.newAddress = ''
    }
}
</script>

<style lang="scss">
.fav-add {
    .theme--light.v-text-field--outline > .v-input__control {
        min-height: 80px;
        .v-input__slot {
            border: 1px solid #b5c0d3 !important;
            border-radius: 0px;
            padding-right: 4px;
            .v-label {
                font-size: 12px;
            }
            .v-icon {
                font-size: 16px;
            }
        }
        .v-input__slot:hover {
            border: 1px solid #3d55a5;
            border-radius: 0px;
        }
    }
    .optional-text {
        margin-top: 6px;
    }
    .address-input {
        .v-input__prepend-inner {
            margin-top: 11px;
            margin-right: 5px;
        }
    }
    .blockie-placeholder {
        background-color: #d8d8d8;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 50%;
        height: 36px;
        width: 36px;
    }
}

.address-table {
    border: 1px solid #b4bfd2;
    max-height: 200px;
}
</style>
