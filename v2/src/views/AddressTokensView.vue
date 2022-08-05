<template>
    <div>
        <!-- <app-error v-if="!isValid" :has-error="!isValid" :message="state.error" /> -->
        <template v-if="isValid">
            <v-row>
                <v-col cols="12">
                    <module-address-tokens class="mb-4" :address-hash="props.addressRef" />
                </v-col>
                <v-col cols="12">
                    <module-address-token-transfers :address-hash="props.addressRef" :new-erc20-transfer="newErc20Transfer" @resetCount="resetCount" />
                </v-col>
            </v-row>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
// import AppError from '@core/components/AppError.vue'
import ModuleAddressTokens from '@module/address/ModuleAddressTokens.vue'
import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
import { eth } from '@core/helper'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
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
