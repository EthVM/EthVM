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
            :subtext="`${tokens.length} total tokens`"
            :class="{ 'd-sm-none': props.isOverview }"
        >
        </address-balance-totals>

        <!--Table Header-->
        <v-row :dense="xs" class="d-flex text-body-1 text-info my-2 my-sm-5">
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
            <v-col sm="4" :lg="props.isOverview ? 4 : 2" class="py-0 d-none d-sm-block"> Token</v-col>
            <!--
                Symbol on Overview:
                XS and UP: NONE
                ------------
                Symbol
                XS: NONE
                LG: 1
             -->
            <v-col v-if="!props.isOverview" sm="1" class="py-0 d-none d-lg-block"> Symbol</v-col>
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
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 text-right text-sm-left"> Price</v-col>
                    <v-col v-if="!props.isOverview" lg="3" class="py-0 d-none d-lg-block"> 24h</v-col>
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 d-none d-sm-block"> USD Value</v-col>
                    <v-col sm="4" :lg="props.isOverview ? 4 : 3" class="py-0 d-none d-sm-flex justify-space-between">
                        <p>Balance</p>
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
        <div v-else>
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
import { computed, reactive, onMounted, ref } from 'vue'
import AppBtn from '@/core/components/AppBtn.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import TableRowTokenBalance from './components/TableRowTokenBalance.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES, Token } from '@module/address/models/TokenSort'
import BN from 'bignumber.js'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { AddressEventType } from '@/apollo/types'
import { useRouter } from 'vue-router'
import { ROUTE_NAME, ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
const { xs } = useDisplay()
const { loading: loadingCoinData } = useCoinData()

const MAX_ITEMS = 10

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
    sortKey: TOKEN_FILTER_VALUES[4],
    sortDirection: 'high',
    index: 0,
    rowRefs: {}
})

const { erc20Tokens, loadingTokens, refetchTokens, tokenSort, tokenBalance, initialLoad } = useAddressToken(props.addressHash)

const hasTokens = computed<boolean>(() => {
    return !!erc20Tokens.value
})

const sortTable = (key: string): void => {
    state.sortDirection = state.sortDirection === 'high' ? 'low' : 'high'
    state.sortKey = `${key}_${state.sortDirection}`
}

const tokens = computed(() => {
    const start = MAX_ITEMS * state.index
    if (!loadingTokens.value && hasTokens.value && tokenSort.value) {
        const end = start + MAX_ITEMS > erc20Tokens.value?.length ? erc20Tokens.value?.length : start + MAX_ITEMS
        return tokenSort.value?.getSortedTokens(state.sortKey)
    }
    return []
})

const totalPages = computed<number>(() => {
    return Math.ceil(new BN(erc20Tokens.value?.length).div(MAX_ITEMS).toNumber())
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
        params: { scroll: state.activeToken }
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
</script>
