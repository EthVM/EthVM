<template>
    <v-container grid-list-lg class="mb-0">
        <app-error v-if="!isValid" :has-error="!isValid" :message="state.error" />
        <template v-if="isValid">
            <module-adress-nfts class="mb-4" :address-hash="props.addressRef" />
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppError from '@core/components/AppError.vue'
import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
import { eth } from '@core/helper'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import ModuleAdressNfts from '@module/address/ModuleAdressNfts.vue'

const props = defineProps({
    addressRef: { type: String, required: true }
})

const state = {
    error: ''
}

const { newErc20Transfer, resetCount } = useAddressUpdate(props.addressRef)

const isValid = computed<boolean>(() => {
    return eth.isValidAddress(props.addressRef)
})

onMounted(() => {
    if (!isValid.value) {
        state.error = 'This is not a valid address hash'
    }
})
</script>
