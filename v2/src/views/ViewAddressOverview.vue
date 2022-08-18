<template>
    <v-row :dense="xs">
        <v-col cols="12" md="6" lg="4">
            <module-address-portfolio :address-ref="props.addressRef" />
        </v-col>
        <v-col cols="12" md="6" lg="4">
            <module-address-balance :address-ref="props.addressRef" is-overview />
        </v-col>
        <v-col cols="12" md="6" lg="4">
            <module-address-token-balance :address-ref="props.addressRef" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import ModuleAddressTokenBalance from '@module/address/ModuleAddressTokenBalance.vue'
import ModuleAddressPortfolio from '@/modules/address/ModuleAddressPortfolio.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
const props = defineProps({
    addressRef: { type: String, required: true }
})
const { xs } = useDisplay()
</script>
