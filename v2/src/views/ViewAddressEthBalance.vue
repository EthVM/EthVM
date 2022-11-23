<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <module-address-balance :address-ref="props.addressRef" />
            </v-card>
            <v-card class="pa-4 pa-sm-6 mt-4 mt-sm-6" elevation="1" rounded="xl">
                <div>
                    <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" @update:modelValue="setLastViewedTab()" class="mb-4 mb-sm-0"></app-tabs>
                    <module-pending-transfers v-if="state.tab === routes[2] || state.tab === routes[3]" :tab="state.tab" :address-ref="props.addressRef" />
                    <module-all-and-internal v-if="state.tab === routes[0] || state.tab === routes[1]" :tab="state.tab" :address-ref="props.addressRef" />
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppTabs from '@/core/components/AppTabs'
import ModulePendingTransfers from '@module/address/ModulePendingEthTransfers.vue'
import ModuleAllAndInternal from '@module/address/ModuleAllAndInternalEthTransfers.vue'
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import { reactive } from 'vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { Tab } from '@core/components/props'
import { Q_ADDRESS_TRANSFERS } from '@core/router/routesNames'

const routes = Q_ADDRESS_TRANSFERS

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

const state = reactive({
    tab: props.tab
})

const { columnPadding, rowMargin } = useAppViewGrid()

const tabs: Tab[] = [
    {
        value: routes[0],
        title: 'All'
    },
    {
        value: routes[1],
        title: 'Internal'
    },
    {
        value: routes[2],
        title: 'TX History'
    },
    {
        value: routes[3],
        title: 'Pending TX'
    }
]

const emit = defineEmits<{
    (e: 'tabChange', newTab: string): void
}>()
/**
 * Emits to parent to remember last visted tab
 */
const setLastViewedTab = (tab: string): void => {
    emit('tabChange', tab)
}
</script>
