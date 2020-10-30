<template>
    <v-dialog v-model="dialog" max-width="445">
        <v-btn slot="activator" flat color="black" fab class="black--text ma-0"
            ><v-img :src="require('@/assets/icon-qr.png')" height="30px" max-width="30px" contain />
        </v-btn>
        <v-card>
            <v-layout grid-list-xs align-center justify-start row fill-height pt-3 px-3>
                <!--
                =====================================================================================
                  BLOCKIE
                =====================================================================================
                -->
                <v-flex shrink>
                    <blockies :address="address" width="40px" height="40px" />
                </v-flex>
                <!--
                =====================================================================================
                  HASH / BUTTONS
                =====================================================================================
                -->
                <v-flex pa-2>
                    <p class="break-hash font-mono">{{ address | toChecksum }}</p>
                </v-flex>
            </v-layout>
            <v-divider class="lineGrey mt-3" />
            <!--
            =====================================================================================
              QR
            =====================================================================================
            -->
            <v-layout row wrap align-center justify-center pa-2>
                <vue-qr v-if="address" :text="serialize" :size="260" />
            </v-layout>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import VueQr from 'vue-qr'
import Blockies from '@app/modules/address/components/Blockies.vue'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
    components: {
        VueQr,
        AppCopyToClip,
        AppTransformHash,
        Blockies
    }
})
export default class AddressQR extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop({ type: String }) address!: string

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    dialog: boolean = false

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */
    get serialize() {
        return this.address
    }
}
</script>

<style scoped lang="css">
.break-hash {
    word-break: break-all;
}
</style>
