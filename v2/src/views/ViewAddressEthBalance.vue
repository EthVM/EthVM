<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <module-address-balance :address-ref="props.addressRef" />
            </v-card>
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <div>
                    <app-tabs
                        v-model="state.tab"
                        :routes="routes"
                        :tabs="tabs"
                        @update:modelValue="setLastViewedTab"
                        class="mb-3 mb-sm-0 mx-n6 mt-n2"
                    ></app-tabs>
                    <module-all-eth-transfers v-if="state.tab === routes[0]" :address-ref="props.addressRef" />
                    <module-eth-txs-history v-if="state.tab === routes[1]" :address-ref="props.addressRef" />
                    <module-internal-eth-transfers v-if="state.tab === routes[2]" :tab="state.tab" :address-ref="props.addressRef" />
                    <module-pending-transfers v-if="state.tab === routes[3]" :tab="state.tab" :address-ref="props.addressRef" />
                    <template v-if="props.isAddressMiner && state.tab === routes[4]">
                        <module-address-miner-block :address-hash="props.addressRef" />
                    </template>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppTabs from '@/core/components/AppTabs.vue'
import ModulePendingTransfers from '@module/address/ModulePendingEthTransfers.vue'
import ModuleInternalEthTransfers from '@module/address/ModuleInternalEthTransfers.vue'
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import ModuleEthTxsHistory from '@module/address/ModuleEthTxsHistory.vue'
import ModuleAddressMinerBlock from '@module/address/ModuleAddressMinerBlock.vue'
import ModuleAllEthTransfers from '@module/address/ModuleAllEthTransfers.vue'
import { reactive, computed, onMounted } from 'vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { Tab } from '@core/components/props'
import { ADDRESS_ROUTE_QUERY, Q_ADDRESS_TRANSFERS } from '@core/router/routesNames'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs } = useDisplay()
const routes = Q_ADDRESS_TRANSFERS
const minerRoutes = ADDRESS_ROUTE_QUERY.Q_MINER

onMounted(() => {
    window.scrollTo(0, 0)
})
const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    tab: {
        type: String,
        required: true
    },
    isAddressMiner: { type: Boolean }
})

const { newMinedBlocks, newMinedUncles, resetCount } = useAddressUpdate(props.addressRef)

const state = reactive({
    tab: props.tab,
    minerTab: minerRoutes[0]
})

const { columnPadding, rowMargin } = useAppViewGrid()

const tabs = computed<Tab[]>(() => {
    const txsText = xs.value ? 'Txs' : 'Transactions'
    const tabs = [
        {
            value: routes[0],
            title: 'All'
        },
        {
            value: routes[1],
            title: txsText
        },
        {
            value: routes[2],
            title: 'Transfers'
        },
        {
            value: routes[3],
            title: 'Pending'
        }
    ]

    return [
        ...tabs,
        props.isAddressMiner && {
            value: routes[4],
            title: 'Rewards'
        }
    ].filter(Boolean)
})

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
