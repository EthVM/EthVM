<template>
    <div>
        <v-row>
            <v-col cols="12" md="6" lg="4">
                <module-address-balance :address-ref="props.addressRef" is-overview />
            </v-col>
            <v-col cols="12" md="6" lg="4">
                <module-address-token-balance :address-ref="props.addressRef" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="6">
                <!-- How the module can be used on the overview page -->
                <module-address-miner-block
                    class="mb-4"
                    reward-type="block"
                    is-overview
                    :address-hash="props.addressRef"
                    :max-items="MAX_ITEMS"
                    :new-rewards="newMinedBlocks"
                    @resetUpdateCount="resetCount"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import ModuleAddressTokenBalance from '@module/address/ModuleAddressTokenBalance.vue'
import ModuleAddressMinerBlock from '@module/address/ModuleAddressMinerBlock.vue'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'

const MAX_ITEMS = 10

const props = defineProps({
    addressRef: { type: String, required: true }
})

const { newMinedBlocks, resetCount } = useAddressUpdate(props.addressRef)
</script>
