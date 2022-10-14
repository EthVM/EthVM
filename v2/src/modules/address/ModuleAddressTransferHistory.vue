<template>
    <div class="pt-4 pt-sm-6">
        <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" @update:modelValue="setLastViewedTab()" class="mb-4 mb-sm-0"></app-tabs>
        <table-mined-and-pending v-if="state.tab === routes[2] || state.tab === routes[3]" :tab="state.tab" />
        <table-all-and-internal v-if="state.tab === routes[0] || state.tab === routes[1]" :tab="state.tab" :address-ref="props.addressRef" />
    </div>
</template>

<script setup lang="ts">
import AppTabs from '@/core/components/AppTabs'
import TableMinedAndPending from '@module/address/components/EthBalanceTabs/TableMinedAndPending.vue'
import TableAllAndInternal from '@module/address/components/EthBalanceTabs/TableAllAndInternal.vue'
import { Tab } from '@/core/components/props'
import { reactive } from 'vue'
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
const setLastViewedTab = (): void => {
    emit('tabChange', state.tab)
}
</script>
