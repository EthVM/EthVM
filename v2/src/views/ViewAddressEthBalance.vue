<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <module-address-balance :address-ref="props.addressRef" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
// import { reactive, onMounted } from 'vue'
// import ModuleAddressTokens from '@module/address/ModuleAddressTokens.vue'
// import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
// import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
// import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
// import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})
</script>
