<template>
    <v-card v-if="add" class="fav-add">
        <!--
        =====================================================================================
          TITLE / CLOSE BTN
        =====================================================================================
        -->
        <v-layout grid-list-xs align-center justify-space-between row fill-height pt-2 pb-2 pl-3 pr-3>
            <v-card-title class="title font-weight-bold"> Add Address Name</v-card-title>
            <v-btn flat icon color="secondary" @click="closeDialog()"> <v-icon class="fas fa-times" /> </v-btn>
        </v-layout>
        <v-divider class="lineGrey mb-1" />
        <v-layout grid-list-xs align-center justify-start row fill-height pt-2 pb-2 pl-3>
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
             ADDRESS/CHIPS
            =====================================================================================
            -->
            <v-flex grow>
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
          INPUT - NAME
        =====================================================================================
        -->

        <v-layout fill-height align-center justify-center pt-2 pb-2 pl-4 pr-4>
            <v-flex xs12>
                <v-text-field v-model="name" :rules="nameRulles" outline clearable counter maxlength="20" label="Enter Name" class="name-input-container">
                </v-text-field>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
         SKIP/ADD BUTONS
        =====================================================================================
        -->
        <v-layout fill-height align-center justify-end pb-4 pl-4 pr-4>
            <v-btn flat color="black" class="text-capitalize mr-3" @click="dialogMethod('')"> Skip </v-btn>
            <v-btn :disabled="disableAdd" depressed color="secondary" class="text-capitalize ma-0" @click="dialogMethod(name)"> Add </v-btn>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import VueQr from 'vue-qr'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppAdrChip from '@app/core/components/ui/AppAdrChip.vue'
import Blockies from '@app/modules/address/components/Blockies.vue'
import { EnumAdrChips } from '@app/core/components/props'

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
    @Prop({ type: String }) address!: string
    @Prop({ type: Boolean }) add!: boolean
    @Prop(Array) chips!: EnumAdrChips[]
    @Prop(Function) dialogMethod!: void

    /*
    ===================================================================================
      Data:
    ===================================================================================
    */
    name: string = ''
    nameRulles = [name => (!!name && name !== '') || 'This field is required', name => (!!name && name.length <= 30) || 'Name must be less than 30 characters']

    /*
    ===================================================================================
      Computed:
    ===================================================================================
    */
    get hasChips(): boolean {
        return this.chips.length > 0
    }

    get disableAdd(): boolean {
        return !this.name || this.name === ''
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    closeDialog(): void {
        this.$emit('closeFavDialog')
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
}
</style>
