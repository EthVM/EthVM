<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="py-6">
                <v-tabs v-model="state.tab" color="primary" end @update:model-value="setLastViewedTab()">
                    <v-tab :value="routes[0]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Blocks</v-tab>
                    <v-tab :value="routes[1]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Uncles</v-tab>
                </v-tabs>
                <v-window v-model="state.tab" class="mt-6">
                    <v-window-item :value="routes[0]" :key="routes[0]">
                        <module-address-miner-block
                            class="mb-4"
                            reward-type="block"
                            :address-hash="props.addressRef"
                            :max-items="MAX_ITEMS"
                            :new-rewards="newMinedBlocks"
                            @resetUpdateCount="resetCount"
                        />
                    </v-window-item>
                    <v-window-item :value="routes[1]" :key="routes[1]">
                        <module-address-miner-block
                            class="mb-4"
                            reward-type="uncle"
                            :address-hash="props.addressRef"
                            :max-items="MAX_ITEMS"
                            :new-rewards="newMinedUncles"
                            @resetUpdateCount="resetCount"
                        />
                    </v-window-item>
                </v-window>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import ModuleAddressMinerBlock from '@module/address/ModuleAddressMinerBlock.vue'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()

const MAX_ITEMS = 10

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
const routes = ADDRESS_ROUTE_QUERY.Q_MINER

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

const router = useRouter()
const route = useRoute()
/**
 * Sets route query if new tab is selected
 */
const changeRoute = () => {
    if (route.query.t !== state.tab) {
        router.push({
            query: { t: state.tab }
        })
    }
}

/**
 * Watches for changes in the router
 * in case user manipulates history
 * and updates tab accordingly
 */
onBeforeRouteUpdate(async to => {
    if (to.query.t !== state.tab) {
        state.tab = state.tab === routes[0] ? routes[1] : routes[0]
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
