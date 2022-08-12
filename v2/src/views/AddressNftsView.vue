<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="1" rounded="xl" class="py-6">
                <module-adress-nfts class="mb-4" :address-hash="props.addressRef" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import ModuleAdressNfts from '@module/address/ModuleAdressNfts.vue'

const props = defineProps({
    addressRef: { type: String, required: true }
})

const { newErc20Transfer, resetCount } = useAddressUpdate(props.addressRef)
</script>
