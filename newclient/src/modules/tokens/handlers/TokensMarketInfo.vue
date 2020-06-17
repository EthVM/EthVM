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
                    <p>Hello</p>
                    <!-- <table-address-tokens-row :token="token" :is-erc20="isERC20" :address="address" :token-price-info="getUSDInfo(token.tokenInfo.contract)" /> -->
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
// import TableAddressTokensRow from '@app/modules/address/components/TableAddressTokensRow.vue'
import TableTokensHeader from '@app/modules/tokens/components/TableTokensHeader.vue'
import { IEthereumToken } from '@app/plugins/CoinData/models'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'

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
        TableTokensHeader
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
                        this.tokensData = data
                        this.initialLoad = false
                        this.totalTokens = this.tokensData.length
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
