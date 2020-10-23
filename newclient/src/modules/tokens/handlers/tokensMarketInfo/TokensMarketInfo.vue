<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title
            :title-caption="$t('token.top-200')"
            :title="getTitle"
            :has-pagination="$vuetify.breakpoint.smAndDown ? false : true"
            :page-type="pageType"
            page-link=""
            class="pl-2"
        >
            <template v-slot:pagination>
                <app-paginate
                    v-if="showPagination"
                    :total="totalPages"
                    :current-page="index"
                    :has-input="true"
                    :has-first="true"
                    :has-last="true"
                    class="pb-2"
                    @newPage="setPage"
                />
            </template>
        </app-table-title>
        <v-layout v-if="!initialLoad" row wrap align-center justify-space-between pl-3 pr-3>
            <v-flex xs12 sm12 hidden-md-and-up>
                <v-layout :align-end="$vuetify.breakpoint.mdAndUp" :align-center="$vuetify.breakpoint.smAndDown" d-flex column>
                    <app-filter :options="options" :show-desktop="false" :is-selected="options[6]" :is-sort="true" @onSelectChange="sortTokens" />
                    <app-paginate
                        v-if="showPagination"
                        :total="totalPages"
                        :current-page="index"
                        :has-input="true"
                        :has-first="true"
                        :has-last="true"
                        class="pb-2"
                        @newPage="setPage"
                    />
                </v-layout>
            </v-flex>
        </v-layout>
        <table-txs :max-items="maxItems" :index="index" :is-loading="initialLoad || hasError" :txs-data="showTokens" :is-scroll-view="false">
            <template #header>
                <table-tokens-header :sort="isSortedBy" :loading="initialLoad || hasError" @sortBy="sortTokens" />
            </template>
            <template #rows>
                <v-card v-for="(token, index) in showTokens" :key="index" class="transparent" flat>
                    <table-tokens-row :token="token" />
                </v-card>
            </template>
        </table-txs>
        <v-layout
            v-if="showPagination && !initialLoad"
            :justify-end="$vuetify.breakpoint.mdAndUp"
            :justify-center="$vuetify.breakpoint.smAndDown"
            row
            class="pb-3 pr-4"
        >
            <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppFilter from '@app/core/components/ui/AppFilter.vue'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableTokensHeader from '@app/modules/tokens/components/TableTokensHeader.vue'
import TableTokensRow from '@app/modules/tokens/components/TableTokensRow.vue'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import BN from 'bignumber.js'
const MAX_TOKENS = 200
const KEY_VOLUME = 'total_volume'
const KEY_SYMBOL = 'symbol'
const KEY_PRICE = 'current_price'
const KEY_MARKET_CAP = 'market_cap'
interface TokensSortedInterface {
    ascend: TokenMarketData[] | null
    desend: TokenMarketData[] | null
}
class TokensSorted implements TokensSortedInterface {
    /* Properties: */
    ascend: TokenMarketData[]
    desend: TokenMarketData[]
    /* Constructor: */
    constructor(data: TokenMarketData[], sortKey: string) {
        this.desend = this.sortByKeyDesend([...data], sortKey)
        if (this.desend.length > MAX_TOKENS) {
            this.desend = this.desend.slice(0, MAX_TOKENS)
        }
        this.ascend = [...this.desend].reverse()
    }
    /* Method to sort object array in desending order by Key: */
    sortByKeyDesend(data: TokenMarketData[], key: string) {
        return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
    }
    getAscend(): TokenMarketData[] {
        return this.ascend
    }
    getDesend(): TokenMarketData[] {
        return this.desend
    }
}
const FILTER_VALUES = ['name_high', 'name_low', 'price_high', 'price_low', 'volume_high', 'volume_low', 'market_cap_high', 'market_cap_low']
@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        TableTxs,
        TableTokensHeader,
        TableTokensRow,
        AppFilter
    }
})
export default class AddressTokens extends Mixins(CoinData) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Number) maxItems!: number
    @Prop(String) address!: string
    @Prop({ type: String, default: 'eth' }) tokenType!: string
    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */
    hasError = false
    pageType = 'tokens'
    initialLoad = true
    index = 0
    totalPages = 3
    totalTokens = 0
    isSortedBy = FILTER_VALUES[6]
    tokensData: TokenMarketData[] | null = null
    tokensByMarket!: TokensSorted
    tokensBySymbol!: TokensSorted
    tokensByPrice!: TokensSorted
    tokensByVolume!: TokensSorted
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get options() {
        return [
            {
                value: FILTER_VALUES[0],
                text: this.$i18n.tc('token.name', 1),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[1],
                text: this.$i18n.tc('token.name', 1),
                filter: this.$i18n.t('filter.low')
            },
            {
                value: FILTER_VALUES[2],
                text: this.$i18n.tc('price.name', 1),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[3],
                text: this.$i18n.tc('price.name', 1),
                filter: this.$i18n.t('filter.low')
            },
            {
                value: FILTER_VALUES[4],
                text: this.$i18n.tc('token.volume', 1),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[5],
                text: this.$i18n.tc('token.volume', 1),
                filter: this.$i18n.t('filter.low')
            },
            {
                value: FILTER_VALUES[6],
                text: this.$i18n.t('token.market'),
                filter: this.$i18n.t('filter.high')
            },
            {
                value: FILTER_VALUES[7],
                text: this.$i18n.t('token.market'),
                filter: this.$i18n.t('filter.low')
            }
        ]
    }
    get showTokens(): TokenMarketData[] {
        const start = this.index * this.maxItems
        if (!this.initialLoad && this.tokensData) {
            const end = start + this.maxItems > this.tokensData.length ? this.tokensData.length : start + this.maxItems
            return this.tokensData.slice(start, end)
        }
        return []
    }
    get showPagination(): boolean {
        return this.totalPages > 1
    }
    get getTitle(): string {
        return `${this.$tc('token.name', 2)}`
    }
    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */
    sortTokens(sort: string): void {
        this.isSortedBy = sort
        this.index = 0
        if (!this.hasError) {
            if (sort === FILTER_VALUES[0] || sort === FILTER_VALUES[1]) {
                /* Sort By Symbol: */
                this.tokensData = sort.includes('high') ? this.tokensBySymbol.getAscend() : this.tokensBySymbol.getDesend()
            } else if (sort === FILTER_VALUES[2] || sort === FILTER_VALUES[3]) {
                /* Sort By Price: */
                this.tokensData = sort.includes('high') ? this.tokensByPrice.getDesend() : this.tokensByPrice.getAscend()
            } else if (sort === FILTER_VALUES[4] || sort === FILTER_VALUES[5]) {
                /* Sort By Volume: */
                this.tokensData = sort.includes('high') ? this.tokensByVolume.getDesend() : this.tokensByVolume.getAscend()
            } else {
                /* Sort By Market Cap: */
                this.tokensData = sort.includes('high') ? this.tokensByMarket.getDesend() : this.tokensByMarket.getAscend()
            }
        }
    }
    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.index = 0
            this.initialLoad = true
            this.totalPages = 0
        } else {
            this.index = page
        }
    }
    emitErrorState(val: boolean): void {
        this.hasError = val
        this.$emit('errorTransfers', val, ErrorMessageToken.tokenMarket)
    }

    /*
    ===================================================================================
      Watch:
    ===================================================================================
    */
    @Watch('isLoadingTokensMarketData')
    onisLoadingTokensMarketData(newVal: boolean, oldVal: boolean) {
        if (!newVal) {
            const marketData = this.getEthereumTokens()
            if (marketData !== false) {
                const marketDataByPrice = new TokensSorted(marketData, KEY_MARKET_CAP).getAscend()
                this.tokensByVolume = new TokensSorted(marketDataByPrice, KEY_VOLUME)
                this.tokensByMarket = new TokensSorted(marketDataByPrice, KEY_MARKET_CAP)
                this.tokensBySymbol = new TokensSorted(marketDataByPrice, KEY_SYMBOL)
                this.tokensByPrice = new TokensSorted(marketDataByPrice, KEY_PRICE)
                this.sortTokens(this.isSortedBy)
                this.totalTokens = marketDataByPrice.length
                this.totalPages = Math.ceil(new BN(this.totalTokens).div(this.maxItems).toNumber())
                this.initialLoad = false
                this.emitErrorState(false)
            } else {
                this.emitErrorState(true)
            }
        }
    }
    /*
    ===================================================================================
      LifeCycle:
    ===================================================================================
    */
    // mounted() {
    //     if (this.tokensData === null) {
    //         const tokenMarketData
    //         this.$CD
    //             .getEthereumTokens()
    //             .then(data => {
    //                 if (data && data.length > 0) {
    //                     this.tokensByVolume = new TokensSorted(data, 'volume')
    //                     this.tokensByMarket = new TokensSorted(data, 'marketCap')
    //                     this.tokensBySymbol = new TokensSorted(data, 'symbol')
    //                     this.tokensByPrice = new TokensSorted(data, 'price')
    //                     this.sortTokens(this.isSortedBy)
    //                     this.initialLoad = false
    //                     this.totalTokens = data.length
    //                     this.totalPages = Math.ceil(new BN(this.totalTokens).div(this.maxItems).toNumber())
    //                 }
    //             })
    //             .catch(error => {
    //                 console.log(error)
    //                 this.error = `${this.$t('message.no-data')}`
    //             })
    //     }
    // }
}
</script>
<style scoped lang="css">
.tx-filter-select-container {
    border: solid 1px #efefef;
    padding-top: 1px;
}
.tx-status {
    min-width: 60px;
}
</style>
