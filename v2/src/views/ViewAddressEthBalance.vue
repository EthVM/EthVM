<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <module-address-balance :address-ref="props.addressRef" />
            </v-card>
            <v-card class="pa-4 pa-sm-6 mt-4 mt-sm-6" elevation="1" rounded="xl">
                <div>
                    <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" @update:modelValue="setLastViewedTab()" class="mb-4 mb-sm-0"></app-tabs>
                    <module-all-and-internal v-if="state.tab === routes[0] || state.tab === routes[1]" :tab="state.tab" :address-ref="props.addressRef" />
                    <module-eth-txs-history v-if="state.tab === routes[2]" :address-ref="props.addressRef" />
                    <module-pending-transfers v-if="state.tab === routes[3]" :tab="state.tab" :address-ref="props.addressRef" />
                    <template v-if="isAddressMiner && state.tab === routes[4]">
                        <module-address-miner-block :address-hash="props.addressRef" />
                        <!--                        <div class="mt-2 mt-sm-6">-->
                        <!--                            <module-address-miner-block-->
                        <!--                                v-show="state.minerTab === minerRoutes[1]"-->
                        <!--                                class="mb-4"-->
                        <!--                                reward-type="uncle"-->
                        <!--                                :address-hash="props.addressRef"-->
                        <!--                                :new-rewards="newMinedUncles"-->
                        <!--                                @resetUpdateCount="resetCount"-->
                        <!--                            />-->
                        <!--                        </div>-->
                    </template>
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
import ModuleEthTxsHistory from '@module/address/ModuleEthTxsHistory.vue'
import ModuleAddressMinerBlock from '@module/address/ModuleAddressMinerBlock.vue'
import { reactive, computed } from 'vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { Tab } from '@core/components/props'
import { ADDRESS_ROUTE_QUERY, Q_ADDRESS_TRANSFERS } from '@core/router/routesNames'
import { useIsAddressMiner } from '@core/composables/IsAddressMiner/isAddressMiner.composable'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'

const routes = Q_ADDRESS_TRANSFERS
const minerRoutes = ADDRESS_ROUTE_QUERY.Q_MINER

const { newMinedBlocks, newMinedUncles, resetCount } = useAddressUpdate(props.addressRef)

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
    tab: props.tab,
    minerTab: minerRoutes[0]
})

const { columnPadding, rowMargin } = useAppViewGrid()

const { isAddressMiner } = useIsAddressMiner(props.addressRef)
const tabs = computed<Tab[]>(() => {
    const tabs = [
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

    return [
        ...tabs,
        isAddressMiner.value && {
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
