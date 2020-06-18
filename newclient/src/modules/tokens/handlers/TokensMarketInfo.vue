<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :title="getTitle" :has-pagination="false" :page-type="pageType" page-link="" />
        <v-divider />
        <v-layout v-if="showPagination && !initialLoad" row wrap align-center justify-space-between pl-3 pr-3>
            <v-flex xs12 md4>
                <p class="info--text">Top 200 tokens</p>
            </v-flex>
            <v-flex hidden-sm-and-down md4>
                <!-- Search Bar -->
            </v-flex>
            <v-flex xs12 md4>
                <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
            </v-flex>
        </v-layout>
        <table-txs :max-items="maxItems" :index="index" :is-loading="initialLoad" :table-message="message" :txs-data="showTokens" :is-scroll-view="false">
            <template #header>
                <table-tokens-header :sort="isSortedBy" :error="error" :loading="initialLoad" @sortBy="sortTokens" />
            </template>
            <template #rows>
                <v-card v-for="(token, index) in showTokens" :key="index" class="transparent" flat>
                    <table-tokens-row :token="token" />
                </v-card>
            </template>
        </table-txs>
        <v-layout v-if="showPagination && !initialLoad" justify-end row class="pb-3 pr-4">
            <app-paginate :total="totalPages" :current-page="index" :has-input="true" :has-first="true" :has-last="true" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
// import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableTokensHeader from '@app/modules/tokens/components/TableTokensHeader.vue'
import TableTokensRow from '@app/modules/tokens/components/TableTokensRow.vue'
import { IEthereumToken } from '@app/plugins/CoinData/models'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'

interface TokensSortedInterface {
    ascend: IEthereumToken[] | null
    desend: IEthereumToken[] | null
}

class TokensSorted implements TokensSortedInterface {
    /* Properties: */
    ascend: IEthereumToken[]
    desend: IEthereumToken[]

    /* Constructor: */
    constructor(data: IEthereumToken[], sortKey: string) {
        this.desend = this.sortByKeyDesend([...data], sortKey)
        this.ascend = [...this.desend].reverse()
    }
    /* Method to sort object array in desending order by Key: */
    sortByKeyDesend(data: IEthereumToken[], key: string) {
        return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
    }
}

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/
const FILTER_VALUES = ['name_high', 'name_low', 'price_high', 'price_low', 'volume_high', 'volume_low', 'market_cap_high', 'market_cap_low']

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        TableTxs,
        TableTokensHeader,
        TableTokensRow
    }
})
export default class AddressTokens extends Vue {
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

    error = ''
    pageType = 'tokens'
    initialLoad = true
    index = 0
    totalPages = 3
    totalTokens = 0
    isSortedBy = FILTER_VALUES[0]
    tokensData: IEthereumToken[] | null = null
    tokensByMarket!: TokensSorted
    tokensBySymbol!: TokensSorted
    tokensByPrice!: TokensSorted
    tokensByVolume!: TokensSorted

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get showTokens(): IEthereumToken[] {
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

    get message(): string {
        if (this.error != '') {
            return this.error
        }
        return ''
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
        if (!this.error) {
            if (sort === FILTER_VALUES[0] || sort === FILTER_VALUES[1]) {
                /* Sort By Symbol: */
                this.tokensData = sort.includes('high') ? this.tokensBySymbol.ascend : this.tokensBySymbol.desend
            } else if (sort === FILTER_VALUES[2] || sort === FILTER_VALUES[3]) {
                /* Sort By Price: */
                this.tokensData = sort.includes('high') ? this.tokensByPrice.desend : this.tokensByPrice.ascend
            } else if (sort === FILTER_VALUES[4] || sort === FILTER_VALUES[5]) {
                /* Sort By Volume: */
                this.tokensData = sort.includes('high') ? this.tokensByVolume.desend : this.tokensByVolume.ascend
            } else {
                /* Sort By Market Cap: */
                this.tokensData = sort.includes('high') ? this.tokensByMarket.desend : this.tokensByMarket.ascend
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

    /*
    ===================================================================================
      LifeCycle:
    ===================================================================================
    */
    mounted() {
        if (this.tokensData === null) {
            this.$CD
                .getEthereumTokens()
                .then(data => {
                    if (data && data.length > 0) {
                        this.tokensByVolume = new TokensSorted(data, 'volume')
                        this.tokensByMarket = new TokensSorted(data, 'marketCap')
                        this.tokensBySymbol = new TokensSorted(data, 'symbol')
                        this.tokensByPrice = new TokensSorted(data, 'price')
                        this.sortTokens(this.isSortedBy)
                        this.initialLoad = false
                        this.totalTokens = data.length
                        this.totalPages = Math.ceil(new BN(this.totalTokens).div(this.maxItems).toNumber())
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.error = `${this.$t('message.no-data')}`
                })
        }
    }
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
