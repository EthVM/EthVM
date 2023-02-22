<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" @update:modelValue="setLastViewedTab()" class="mx-n1 mt-n2 mb-4"></app-tabs>
                <module-address-tokens
                    v-if="state.tab === routes[0]"
                    class="mb-4"
                    :address-hash="props.addressRef"
                    :new-erc20-transfer="newErc20Transfer"
                    :scroll-id="scrollId"
                    @resetCount="resetCount"
                    :key="routes[0]"
                />
                <module-address-token-transfers
                    v-if="state.tab === routes[1]"
                    :address-hash="props.addressRef"
                    :new-erc20-transfer="newErc20Transfer"
                    @resetCount="resetCount"
                    :key="routes[1]"
                />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import ModuleAddressTokens from '@module/address/ModuleAddressTokens.vue'
import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()

const routes = ADDRESS_ROUTE_QUERY.Q_TOKENS

const tabs: Tab[] = [
    {
        value: routes[0],
        title: 'Balance'
    },
    {
        value: routes[1],
        title: 'Transfers'
    }
]

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    tab: {
        type: String,
        required: true
    },
    scrollId: {
        type: String,
        required: false
    }
})

const state = reactive({
    error: '',
    tab: props.tab
})
const { newErc20Transfer, resetCount } = useAddressUpdate(props.addressRef)

/**------------------------
 * Route Handling
 -------------------------*/
/**
 * Check route query and set appropriate tab in the parent if dont match
 */
onMounted(() => {
    if (props.tab !== routes[0]) {
        setLastViewedTab()
    }
})

const emit = defineEmits<{
    (e: 'tabChange', newTab: string): void
}>()
/**
 * Emits to parent to remember last visted tab
 */
const setLastViewedTab = (): void => {
    emit('tabChange', state.tab)
}
</script>
