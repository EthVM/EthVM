<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-2 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" @update:modelValue="setLastViewedTab()" class="mb-4 mb-sm-0"></app-tabs>
                <div class="mt-6">
                    <module-address-miner-block
                        v-show="state.tab === routes[0]"
                        class="mb-4"
                        reward-type="block"
                        :address-hash="props.addressRef"
                        :max-items="MAX_ITEMS"
                        :new-rewards="newMinedBlocks"
                        @resetUpdateCount="resetCount"
                    />
                    <module-address-miner-block
                        v-show="state.tab === routes[1]"
                        class="mb-4"
                        reward-type="uncle"
                        :address-hash="props.addressRef"
                        :max-items="MAX_ITEMS"
                        :new-rewards="newMinedUncles"
                        @resetUpdateCount="resetCount"
                    />
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { onMounted, reactive } from 'vue'
import ModuleAddressMinerBlock from '@module/address/ModuleAddressMinerBlock.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()

const MAX_ITEMS = 10

const routes = ADDRESS_ROUTE_QUERY.Q_MINER

const tabs: Tab[] = [
    {
        value: routes[0],
        title: 'Blocks'
    },
    {
        value: routes[1],
        title: 'Uncles'
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
    }
})

const { newMinedBlocks, newMinedUncles, resetCount } = useAddressUpdate(props.addressRef)

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
    (e: 'tabChange', newTab: string): void
}>()
/**
 * Emits to parent to remember last visted tab
 */
const setLastViewedTab = (): void => {
    emit('tabChange', state.tab)
}
</script>
