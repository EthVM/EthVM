<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-2 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" @update:modelValue="setLastViewedTab()" class="mx-n1 mt-n2 mb-4"></app-tabs>
                <module-address-recent-nfts :is-overview="false" v-show="state.tab === routes[0]" class="mb-4" :address-hash="props.addressRef" />
                <module-address-nft-transfers v-show="state.tab === routes[1]" class="mb-4" :address-hash="props.addressRef" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressNftTransfers from '@module/address/ModuleAddressNftTransfers.vue'
import ModuleAddressRecentNfts from '@module/address/ModuleAddressRecentNfts.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { onMounted, reactive } from 'vue'

const { columnPadding, rowMargin } = useAppViewGrid()

const routes = ADDRESS_ROUTE_QUERY.Q_NFTS

const tabs: Tab[] = [
    {
        value: routes[0],
        title: 'Collection'
    },
    {
        value: routes[1],
        title: 'Transfers'
    }
]

const props = defineProps({
    addressRef: { type: String, required: true },
    tab: {
        type: String,
        required: true
    }
})

const state = reactive({
    error: '',
    tab: props.tab
})

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
    (e: 'tabChange', newTab: string, isNFT: true): void
}>()
/**
 * Emits to parent to remember last visted tab
 */
const setLastViewedTab = (): void => {
    emit('tabChange', state.tab, true)
}
</script>
