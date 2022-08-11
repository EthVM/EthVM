<template>
    <v-row>
        <v-col cols="12" md="6" lg="4">
            <module-address-balance :address-ref="props.addressRef" />
        </v-col>
        <v-col cols="12" md="6" lg="4">
            <module-address-token-balance :address-ref="props.addressRef" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import ModuleAddressTokenBalance from '@module/address/ModuleAddressTokenBalance.vue'

const props = defineProps({
    addressRef: { type: String, required: true }
})
</script>
