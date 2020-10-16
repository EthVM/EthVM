<template>
    <v-card class="fav-add">
        <!--
        =====================================================================================
          TITLE / CLOSE BTN
        =====================================================================================
        -->
        <v-layout grid-list-xs align-center justify-space-between row fill-height pt-2 pb-2 pl-3 pr-3>
            <v-card-title class="title font-weight-bold"> {{ title }}</v-card-title>
            <v-btn flat icon color="secondary" @click="closeDialog()"> <v-icon class="fas fa-times" /> </v-btn>
        </v-layout>
        <v-divider class="lineGrey mb-1" />
        <v-layout v-if="!isNew" grid-list-xs align-center justify-start row fill-height pt-2 pb-2 pl-3>
            <!--
            =====================================================================================
              BLOCKIE
            =====================================================================================
            -->
            <v-flex shrink>
                <v-layout align-center justify-center row fill-height pa-2>
                    <blockies :address="address" />
                </v-layout>
            </v-flex>
            <!--
            =====================================================================================
             ADDRESS/CHIPS/NAME
            =====================================================================================
            -->
            <v-flex grow pl-2>
                <v-layout v-if="hasChips" align-center justify-start row>
                    <v-flex v-for="(chip, index) in chips" :key="index" shrink>
                        <app-adr-chip :chip="chip" />
                    </v-flex>
                </v-layout>
                <p class="pt-2">{{ address }}</p>
            </v-flex>
        </v-layout>
        <!--
            =====================================================================================
             NEW ADDRESS INPUT
            =====================================================================================
            -->
        <v-layout v-if="isNew" fill-height align-center justify-center row wrap pt-4 pb-2 pl-4 pr-4>
            <v-flex xs12>
                <v-text-field
                    v-model="newAddress"
                    :label="$t('fav.dialog.enter-address')"
                    :rules="addressRules"
                    outline
                    clearable
                    counter
                    maxlength="42"
                    class="name-input-container address-input"
                >
                    <template v-slot:prepend-inner>
                        <div v-if="!isValidAddress" class="blockie-placeholder" />
                        <blockies v-if="isValidAddress" :address="newAddress" width="36px" height="36px" />
                    </template>
                </v-text-field>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          INPUT - NAME
        =====================================================================================
        -->
        <p v-if="isEditMode && addrName && addrName !== ''" class="info--text pl-4 pr-3 pt-2 pb-2 center--text">
            {{ $t('fav.dialog.current-name') }}: <span class="black--text"> {{ addrName }}</span>
        </p>

        <v-layout v-if="add" fill-height align-center justify-center row wrap pt-2 pb-2 pl-4 pr-4>
            <v-flex xs12>
                <v-text-field v-model="name" :rules="nameRules" :label="inputLabel" outline clearable counter maxlength="20" class="name-input-container">
                    <template v-slot:append>
                        <span class="caption greyPlaceholder--text optional-text">{{ $t('fav.dialog.optional') }}</span>
                    </template>
                </v-text-field>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          DELETE TEXT
        =====================================================================================
        -->
        <p v-if="!add" class="pl-4 pr-4 pt-2 pb-2 body-2">{{ $t('fav.dialog.delete-are-you-sure') }}</p>
        <v-layout v-if="!add" row align-start justify-start pb-2 pl-4 pr-4>
            <v-flex shrink pt-2 pb-2>
                <p class="info--text">{{ $t('fav.dialog.delete-tip') }}</p>
            </v-flex>
            <v-flex pa-2>
                <p class="info--text">{{ $t('fav.dialog.delete-tip-text') }}</p>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
         CANCEL/ADD BUTONS
        =====================================================================================
        -->
        <v-layout fill-height align-center justify-end pb-4 pl-4 pr-4>
            <v-btn v-if="isEditMode" flat color="black" class="text-capitalize mr-3" @click="closeDialog()">
                {{ $t('common.cancel') }}
            </v-btn>
            <v-btn
                :disabled="disableAdd"
                :color="rightBtnCollor"
                depressed
                class="text-capitalize ma-0"
                @click="
                    dialogMethod(value)
                    closeDialog()
                    clear()
                "
            >
                {{ rightBtnText }}</v-btn
            >
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import VueQr from 'vue-qr'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppAdrChip from '@app/core/components/ui/AppAdrChip.vue'
import Blockies from '@app/modules/address/components/Blockies.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { eth } from '@app/core/helper'

type Rules = (data: string) => void

@Component({
    components: {
        AppAdrChip,
        Blockies
    }
})
export default class FavAddDialog extends Vue {
    /*
    ===================================================================================
      Props:
    ===================================================================================
    */
    @Prop({ type: String }) address?: string
    @Prop({ type: Boolean }) add!: boolean
    @Prop({ type: Boolean }) isNew?: boolean
    @Prop(Array) chips?: EnumAdrChips[]
    @Prop(Function) dialogMethod!: void
    @Prop(String) addrName?: string
    @Prop({ type: Boolean, default: false }) isEditMode!: boolean

    /*
    ===================================================================================
      Data:
    ===================================================================================
    */
    name: string = ''
    newAddress: string = ''

    /*
    ===================================================================================
      Computed:
    ===================================================================================
    */
    get value(): object | string {
        if (this.isNew) {
            return { name: this.name, address: this.newAddress }
        }
        return this.name
    }
    get nameRules(): Rules[] {
        const rules = [name => (!!name && name.length <= 20) || this.$t('fav.dialog.input-length')]
        return rules
    }
    get addressRules(): Rules[] {
        const rules = [
            newAddress => (!!newAddress && newAddress !== '') || this.$t('fav.dialog.input-required'),
            newAddress => eth.isValidAddress(newAddress) || this.$t('fav.dialog.invalid-address')
        ]
        return rules
    }
    get hasChips(): boolean {
        if ((!this.add && this.addrName && this.addrName !== '') || !this.chips) {
            return false
        }
        return this.chips.length > 0
    }

    get disableAdd(): boolean {
        if (!this.add) {
            return false
        }
        return !this.isValidAddress
    }

    get title(): string {
        if (this.isNew) {
            return this.$t('fav.dialog.add-new').toString()
        }
        if (this.isEditMode) {
            return this.$t('fav.dialog.title-edit').toString()
        }
        return this.add ? this.$t('fav.dialog.title-add').toString() : this.$t('fav.dialog.title-delete').toString()
    }

    get rightBtnText(): string {
        if (this.isEditMode) {
            return this.$t('fav.btn.change').toString()
        }
        return this.add ? this.$t('fav.btn.add').toString() : this.$t('fav.btn.delete').toString()
    }
    get rightBtnCollor(): string {
        return this.add ? 'secondary' : 'error'
    }

    get inputLabel(): string {
        return this.isEditMode ? this.$t('fav.dialog.label-edit').toString() : this.$t('fav.dialog.label-add').toString()
    }

    get isValidAddress(): boolean {
        return eth.isValidAddress(this.isNew ? this.newAddress : this.address)
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    closeDialog(): void {
        this.$emit('closeFavDialog')
    }
    clear(): void {
        this.name = ''
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
</style>
