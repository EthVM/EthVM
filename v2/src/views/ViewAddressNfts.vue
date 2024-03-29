<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <app-ad-buttons-large />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" @update:modelValue="setLastViewedTab()" class="mx-n1 mt-n2 mb-4"></app-tabs>
                <module-address-recent-nfts :is-overview="false" v-show="state.tab === routes[0]" class="mb-4" :address-hash="props.addressRef" />
                <module-address-nft-transfers v-show="state.tab === routes[1]" class="mb-4" :address-hash="props.addressRef" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import ModuleAddressNftTransfers from '@module/address/ModuleAddressNftTransfers.vue'
import ModuleAddressRecentNfts from '@module/address/ModuleAddressRecentNfts.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { onMounted, reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { VIEW_TAGS } from '@core/helper/tags'
import { usePageMeta } from '@core/composables/use-page-meta/use-page-meta.composable'

const { t } = useI18n()
const { columnPadding, rowMargin } = useAppViewGrid()

const routes = ADDRESS_ROUTE_QUERY.Q_NFTS

const tabs: Tab[] = [
    {
        value: routes[0],
        title: t('token.collection')
    },
    {
        value: routes[1],
        title: t('common.transfer')
    }
]

const props = defineProps({
    addressRef: { type: String, required: true },
    tab: {
        type: String,
        required: true
    }
})
const { addressRef } = toRefs(props)
usePageMeta(addressRef, VIEW_TAGS.ADR_NFT)

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
    window.scrollTo(0, 0)
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
