<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-2 pt-sm-6">
                <v-tabs v-model="state.tab" color="primary" end @update:model-value="setLastViewedTab()">
                    <v-tab :value="routes[0]" class="py-3 text-h5 text-capitalize rounded-t-xl" @click="changeRoute">Collection</v-tab>
                    <v-tab :value="routes[1]" class="py-3 text-h5 text-capitalize rounded-t-xl" @click="changeRoute">Transfers</v-tab>
                </v-tabs>
                <div class="mt-6">
                    <module-address-nfts v-show="state.tab === routes[0]" class="mb-4" :address-hash="props.addressRef" />
                    <module-address-nft-transfers v-show="state.tab === routes[1]" class="mb-4" :address-hash="props.addressRef" />
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressNfts from '@module/address/ModuleAddressNfts.vue'
import ModuleAddressNftTransfers from '@module/address/ModuleAddressNftTransfers.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { onMounted, reactive } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
const { columnPadding, rowMargin } = useAppViewGrid()
const props = defineProps({
    addressRef: { type: String, required: true },
    tab: {
        type: String,
        required: true
    }
})

const routes = ADDRESS_ROUTE_QUERY.Q_NFTS

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
