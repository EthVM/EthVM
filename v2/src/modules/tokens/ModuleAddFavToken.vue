<template>
    <div>
        <app-btn :text="$t('token.addToken')" @click="setDialog(true)"></app-btn>
        <app-dialog v-model="state.openDialog" :title="$t('token.addToken')" @update:modelValue="setDialog">
            <template #no-scroll-content>
                <app-input
                    v-model="state.tokenSearch"
                    :has-error="hasUserError"
                    :place-holder="$t('token.searchTokenName')"
                    @on-user-input="setNewTokenSearch"
                    class="w-100"
                ></app-input>
            </template>
            <template #scroll-content>
                <template v-if="!loadingCoinData">
                    <template v-if="searchTokens.length === 0 && state.tokenSearch === ''">
                        <div v-for="token in defaultTokens" :key="token.contract">
                            <token-market-info-table-row v-if="token" :token="token" is-compact-View />
                        </div>
                    </template>
                    <template v-else-if="searchTokens.length > 0">
                        <div v-for="token in searchTokens" :key="token.contract">
                            <token-market-info-table-row v-if="token" :token="token" is-compact-View />
                        </div>
                    </template>
                    <template v-else>
                        <app-no-result :text="`${$t('token.noMatch')}: ${state.tokenSearch}`"></app-no-result>
                    </template>
                </template>
                <div v-else class="skeleton-box rounded-xl mt-1 my-4" style="height: 90%"></div>
            </template>
        </app-dialog>
    </div>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import AppDialog from '@core/components/AppDialog.vue'
import AppNoResult from '@core/components/AppNoResult.vue'
import AppInput from '@core/components/AppInput.vue'
import TokenMarketInfoTableRow from '@module/tokens/components/token-market-info/TableRowTokenMarketInfo.vue'
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { TOKEN_FILTER_VALUES, TokenSortMarket, TokenMarket } from '@module/address/models/TokenSort'

const store = useStore()

interface ComponentState {
    openDialog: boolean
    tokenSearch: string
}

const state: ComponentState = reactive({
    openDialog: false,
    tokenSearch: ''
})

const { tokensWithMarketCap, loading: loadingCoinData } = useCoinData()

/**
 * Changes open/close state of the add dialog
 */
const setDialog = (_value: boolean) => {
    state.openDialog = _value
}

/**
 * Returns default tokens list
 */
const defaultTokens = computed<TokenMarket[]>(() => {
    if (!store.loadingCoinData && tokensWithMarketCap) {
        const filtered = tokensWithMarketCap.value.filter((x): x is TokenMarketData => x !== null)
        const all = filtered.map(i => new TokenMarket(i))
        const topTokens = new TokenSortMarket(all).getSortedTokens(TOKEN_FILTER_VALUES[13]).splice(0, 6)
        return new TokenSortMarket(topTokens).getSortedTokens(TOKEN_FILTER_VALUES[13])
    }
    return []
})

/**
 * Returns search results tokens list
 */
const searchTokens = computed<TokenMarket[]>(() => {
    if (!loadingCoinData.value && state.tokenSearch !== '') {
        const tokensInMarket = tokensWithMarketCap.value
            .filter(i => i.symbol.toLowerCase().includes(state.tokenSearch.toLowerCase()) || i.name.toLowerCase().includes(state.tokenSearch.toLowerCase()))
            .map(i => new TokenMarket(i))
        const flagged: TokenMarket[] = []
        const notFlagged: TokenMarket[] = []
        tokensInMarket.forEach(i => {
            const flag = i.name.toLowerCase().startsWith(state.tokenSearch) || i.symbol.toLowerCase().startsWith(state.tokenSearch)
            if (flag) {
                flagged.push(i)
            } else if (notFlagged.length < 6) {
                notFlagged.push(i)
            }
        })

        return [...flagged, ...notFlagged.slice(0, 20)]
    }
    return []
})

/** -------------------
 * Search Input Handler
 * --------------------/

/**
 * Sets user input with timeout from child
 * @param _value user input
 */
const setNewTokenSearch = (_value: string) => {
    state.tokenSearch = _value
}

const hasUserError = computed<boolean>(() => {
    return state.tokenSearch !== '' && searchTokens.value.length === 0
})
</script>

<style scoped lang="scss"></style>
