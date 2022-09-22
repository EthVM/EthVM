<template>
    <v-card :variant="!props.isOverview ? 'flat' : 'elevated'" :elevation="props.isOverview ? 1 : 0" rounded="xl" class="pa-4 pa-sm-6">
        <v-card-title class="d-none d-sm-flex justify-space-between align-center pa-0">
            <div>
                <span v-if="props.isOverview" class="text-h6 font-weight-bold">Token Balance</span>
                <!-- Notice new update-->
                <app-new-update
                    :icon-only="props.isOverview"
                    text="Token's Balance Changed, Refresh"
                    :update-count="props.newErc20Transfer"
                    @reload="setPage(0, true)"
                />
            </div>
            <template v-if="props.isOverview">
                <app-btn text="More" is-small icon="east" @click="goToTokensBalancePage"></app-btn>
            </template>
        </v-card-title>
        <address-balance-totals
            title="Token Balance"
            :is-loading="loadingTokens || loadingCoinData"
            :balance="tokenBalance"
            :subtext="`${tokensLength} total tokens`"
            :class="{ 'd-sm-none': props.isOverview }"
        >
        </address-balance-totals>

        <!--Table Header-->
        <v-row :dense="xs" class="d-flex text-body-1 text-info mt-2 mt-sm-5 mb-sm-3">
            <!--
                Token on Overview:
                XS: NONE
                SM and UP: 4
                ------------
                Token:
                XS: NONE
                SM : 4
                LG: 2 
             -->
            <v-col sm="4" :lg="props.isOverview ? 4 : 2" class="py-0 d-none d-sm-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.NAME)">
                    Token <v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
            <!--
                Symbol on Overview:
                XS and UP: NONE
                ------------
                Symbol
                XS: NONE
                LG: 1
             -->
            <v-col v-if="!props.isOverview" sm="1" class="py-0 d-none d-lg-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.SYMBOL)">
                    Symbol <v-icon v-if="isActiveSort(SORT_KEY.SYMBOL)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                ></v-col
            >
            <!--
                OTHER on Overview:
                XS: NONE
                SM: 8
                ------------
                OTHER 
                XS: NONE
                SM: 8
                LG: 9
             -->
            <v-col cols="12" sm="8" :lg="props.isOverview ? 8 : 9" class="d-none d-sm-flex">
                <v-row>
                    <!--PRICE -->
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 text-right text-sm-left">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.PRICE)">
                            Price <v-icon v-if="isActiveSort(SORT_KEY.PRICE)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        ></v-col
                    >
                    <v-col v-if="!props.isOverview" lg="3" class="py-0 d-none d-lg-block">
                        <v-btn
                            variant="text"
                            color="info"
                            class="font-weight-regular ml-n3"
                            rounded="pill"
                            size="small"
                            @click="sortTable(SORT_KEY.PERCENTAGE_CHANGE)"
                        >
                            24h<v-icon v-if="isActiveSort(SORT_KEY.PERCENTAGE_CHANGE)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        ></v-col
                    >
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 d-none d-sm-block">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.USD)">
                            USD Value <v-icon v-if="isActiveSort(SORT_KEY.USD)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        ></v-col
                    >
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 d-none d-sm-flex justify-space-between">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.BALANCE)">
                            Balance <v-icon v-if="isActiveSort(SORT_KEY.BALANCE)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                        <p v-if="!props.isOverview" class="text-right">More</p>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider class="my-0 mx-n4 mx-sm-n6 mb-1 mb-sm-5" />
        <!--Loading -->
        <v-row v-if="loadingTokens || loadingCoinData">
            <v-col v-for="col in 10" :key="col" cols="12" class="my-1">
                <div class="skeleton-box rounded-xl" style="min-height: 44px"></div>
            </v-col>
        </v-row>
        <!--Token Row -->
        <div
            v-else-if="renderState.renderTable"
            :class="{ 'module-body mx-n4 mx-sm-n6 px-4 px-sm-6 mt-n1 mt-sm-n5 pt-1 pt-sm-5': props.isOverview }"
            :style="tableHeight"
        >
            <div v-for="token in tokens" :key="token.contract" :ref="el => assignRef(token.contract, el)">
                <table-row-token-balance
                    :token="token"
                    :is-overview="props.isOverview"
                    @setActiveToken="routeToToken"
                    :is-active="props.scrollId === token.contract"
                >
                </table-row-token-balance>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import AppBtn from '@/core/components/AppBtn.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import TableRowTokenBalance from './components/TableRowTokenBalance.vue'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES, KEY, DIRECTION } from '@module/address/models/TokenSort'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { AddressEventType } from '@/apollo/types'
import { useRouter } from 'vue-router'
import { ROUTE_NAME, ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useAppTableRowRender } from '@core/composables/AppTableRowRender/useAppTableRowRender.composable'
const { xs } = useDisplay()
const { loading: loadingCoinData } = useCoinData()

const props = defineProps({
    addressHash: {
        type: String,
        required: true
    },
    isOverview: {
        type: Boolean,
        default: false
    },
    newErc20Transfer: Number,
    scrollId: {
        type: String,
        required: false
    }
})

const emit = defineEmits<{
    (e: 'resetCount', eventType: AddressEventType, isReset: boolean): void
}>()

interface RowRef {
    [contract: string]: HTMLInputElement | null
}

interface ComponentState {
    showMoreTokenDetails: boolean
    activeToken: string
    sortKey: string
    sortDirection: string
    index: number
    rowRefs: RowRef
}

const state: ComponentState = reactive({
    showMoreTokenDetails: false,
    activeToken: '',
    sortKey: TOKEN_FILTER_VALUES[5],
    sortDirection: 'high',
    index: 0,
    rowRefs: {}
})

const { erc20Tokens, loadingTokens, refetchTokens, tokenSort, tokenBalance, initialLoad } = useAddressToken(props.addressHash)

const hasTokens = computed<boolean>(() => {
    return !!erc20Tokens.value
})

const tokensLength = computed<number>(() => {
    if (!loadingTokens.value && hasTokens.value && tokenSort.value) {
        return tokenSort.value?.getSortedTokens(state.sortKey).length
    }
    return 0
})

const { renderState } = useAppTableRowRender(tokensLength.value)

const tokens = computed(() => {
    if (!loadingTokens.value && hasTokens.value && tokenSort.value) {
        return renderState.isActive
            ? tokenSort.value?.getSortedTokens(state.sortKey).slice(0, renderState.maxItems)
            : tokenSort.value?.getSortedTokens(state.sortKey)
    }
    return []
})

const setPage = (page: number, reset = false): void => {
    if (reset) {
        refetchTokens()
        emit('resetCount', AddressEventType.NewErc20Transfer, true)
    }
    state.index = page
}

const router = useRouter()

const routeToToken = (id: string) => {
    state.activeToken = id
    goToTokensBalancePage()
}

const goToTokensBalancePage = async () => {
    await router.push({
        name: ROUTE_NAME.ADDRESS_TOKENS.NAME,
        query: { t: ADDRESS_ROUTE_QUERY.Q_TOKENS[0] },
        params: { scrollId: state.activeToken }
    })
}

// Scroll Bahavior
const assignRef = (contract: string, el: HTMLInputElement | null) => {
    state.rowRefs[contract] = el
}

onMounted(() => {
    if (!props.isOverview && props.scrollId) {
        const el = state.rowRefs[props.scrollId]
        if (el) {
            const offsetPage = xs.value ? 280 : 200
            window.scrollTo({
                top: el.offsetTop + offsetPage,
                left: 100,
                behavior: 'smooth'
            })
        }
    }
})

const tableHeight = computed(() => {
    if (props.isOverview && state.rowRefs) {
        const refIds = Object.getOwnPropertyNames(state.rowRefs)
        const rowHeight = state.rowRefs[refIds[0]]?.offsetHeight
        const offset = xs.value ? 4 : 20
        if (rowHeight) {
            const maxHeight = rowHeight * 7 + offset
            return { maxHeight: `${maxHeight}px` }
        }
    }
    return {}
})

const sortTable = (key: KEY): void => {
    state.sortDirection = state.sortDirection === DIRECTION.HIGH ? DIRECTION.LOW : DIRECTION.HIGH
    state.sortKey = `${key}_${state.sortDirection}`
}
const sortIcon = computed<string>(() => {
    return state.sortDirection === DIRECTION.HIGH ? 'south' : 'north'
})

const isActiveSort = (key: KEY): boolean => {
    return state.sortKey.includes(key)
}
onBeforeUnmount(() => {
    state.rowRefs = {}
})

const SORT_KEY = KEY
</script>
<style scoped>
.module-body {
    overflow-y: overlay;
    background: transparent;
}
.module-body::-webkit-scrollbar {
    width: 8px;
}
.module-body::-webkit-scrollbar-thumb {
    background-color: rgb(var(--v-theme-loading));
    border: 2px solid rgb(var(--v-theme-loading));
    border-radius: 10rem;
}
.module-body::-webkit-scrollbar-track {
    position: absolute;
    right: -20rem;
    top: -50rem;
    background: transparent;
}
</style>
