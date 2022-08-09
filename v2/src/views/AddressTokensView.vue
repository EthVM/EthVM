<template>
    <div>
        <v-card elevation="1" rounded="xl">
            <v-tabs v-model="state.tab" color="primary" end @update:model-value="setLastViewedTab()">
                <v-tab :to="{ query: { t: routes[0] } }" :value="routes[0]" class="py-3 text-h5 text-capitalize rounded-b-xl">Balance</v-tab>
                <v-tab :to="{ query: { t: routes[1] } }" :value="routes[1]" class="py-3 text-h5 text-capitalize rounded-b-xl">Transfers</v-tab>
            </v-tabs>
            <v-window v-model="state.tab" class="mt-6">
                <v-window-item :value="routes[0]" class="mx-2 mx-sm-6 mx-xl-auto">
                    <module-address-tokens class="mb-4" :address-hash="props.addressRef" />
                </v-window-item>
                <v-window-item :value="routes[1]" class="mx-2 mx-sm-6 mx-xl-auto">
                    <module-address-token-transfers :address-hash="props.addressRef" :new-erc20-transfer="newErc20Transfer" @resetCount="resetCount" />
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import ModuleAddressTokens from '@module/address/ModuleAddressTokens.vue'
import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    tab: {
        type: String,
        required: true
    }
})
const routes = ADDRESS_ROUTE_QUERY.Q_TOKENS

const state = reactive({
    error: '',
    tab: props.tab
})

const { newErc20Transfer, resetCount } = useAddressUpdate(props.addressRef)

const emit = defineEmits<{
    (e: 'tabChange', newTab: string): void
}>()

const setLastViewedTab = (): void => {
    emit('tabChange', state.tab)
}

onMounted(() => {
    state.tab = props.tab
})
</script>
