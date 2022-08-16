<template>
    <v-card>
        <v-card-title class="justify-space-between">
            <div>
                Token Transfer History
                <app-new-update text="New ERC20 Transfers" :update-count="props.newErc20Transfer" @reload="setPage(0, true)" />
            </div>
            <app-paginate-has-more
                :class="smAndDown ? 'pt-3' : ''"
                :has-more="hasMore"
                :current-page="state.index"
                :loading="loadingTransfers"
                @newPage="setPage"
            />
        </v-card-title>
        <div>
            <!--            Table Header-->
            <v-row class="ma-0 bg-primary">
                <v-col cols="2">
                    <v-row class="ma-0" align="center"> Token </v-row>
                </v-col>
                <v-col cols="1">
                    <v-row class="ma-0" align="center"> Symbol </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0" align="center"> Amount </v-row>
                </v-col>
                <v-col cols="1">
                    <v-row class="ma-0" align="center"> From/To </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0 flex-nowrap" align="center"> Address </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0 flex-nowrap" align="center"> Timestamp </v-row>
                </v-col>
                <v-col cols="2">Hash</v-col>
            </v-row>
            <v-divider />
            <template v-if="loadingTransfers">
                <div v-for="item in 10" :key="item" class="my-2">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                </div>
            </template>
            <template v-else>
                <v-row
                    v-for="(transfer, index) in transfers"
                    :key="`${transfer.transfer.transactionHash} - ${index}`"
                    class="ma-0 text-subtitle-2 font-weight-regular"
                    align="center"
                >
                    <v-col cols="2">
                        <v-row class="ma-0" align="center">
                            <div class="token-image">
                                <img :src="getImg(transfer.contract) || require('@/assets/icon-token.png')" alt="" height="24" width="24" class="mr-2" />
                            </div>
                            <router-link
                                v-if="transfer.tokenInfo.name !== '' || transfer.tokenInfo.symbol"
                                :to="`/token/${transfer.contract}`"
                                class="black--text"
                            >
                                <p v-if="transfer.tokenInfo.name">{{ transfer.tokenInfo.name }}</p>
                                <p v-else class="text-uppercase caption">{{ transfer.tokenInfo.symbol }}</p>
                            </router-link>
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-row class="ma-0" align="center">{{ transfer.tokenInfo.symbol }}</v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row class="ma-0" align="center">
                            <p>
                                {{ getAmount(transfer).value }}
                                <app-tooltip v-if="getAmount(transfer).tooltipText" :text="`${getAmount(transfer).tooltipText} ${transfer.tokenInfo.symbol}`" />
                            </p>
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-row class="ma-0" align="center">
                            <v-icon :class="transferType(transfer) === 'in' ? 'text-green' : 'text-red'">
                                {{ transferType(transfer) === 'in' ? 'west' : 'east' }}
                            </v-icon>
                            {{ transferType(transfer) === 'in' ? 'From' : 'To' }}
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row class="ma-0 flex-nowrap" align="center">
                            <app-transform-hash :hash="eth.toCheckSum(transferTypeAddress(transfer))" />
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row class="ma-0 flex-nowrap" align="center">
                            {{ timeAgo(new Date(transfer.transfer.timestamp * 1e3)) }}
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <app-transform-hash :hash="eth.toCheckSum(transfer.transfer.transactionHash)" />
                    </v-col>
                </v-row>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import AppPaginateHasMore from '@core/components/AppPaginateHasMore.vue'
import AppTooltip from '@core/components/AppTooltip.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { formatFloatingPointValue } from '@core/helper/number-format-helper'
const { getEthereumTokensMap } = useCoinData()
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { TransferFragmentFragment as Transfer, useGetAddressErc20TransfersQuery } from '@module/address/apollo/AddressTransfers/transfers.generated'
import { eth, timeAgo } from '@core/helper'
import BN from 'bignumber.js'

const MAX_ITEMS = 10
const TYPES = ['in', 'out', 'self']

const { smAndDown } = useDisplay()
const props = defineProps({
    addressHash: {
        type: String,
        required: true
    },
    newErc20Transfer: Number
})

const emit = defineEmits<{
    (e: 'resetCount'): void
}>()

interface ComponentState {
    showMoreTokenDetails: boolean
    activeToken: false | TokenMarketData
    sortKey: string
    sortDirection: string
    index: number
}

const state: ComponentState = reactive({
    showMoreTokenDetails: false,
    activeToken: false,
    sortKey: TOKEN_FILTER_VALUES[1],
    sortDirection: 'high',
    index: 0
})

const {
    result,
    loading: loadingTransfers,
    fetchMore,
    refetch
} = useGetAddressErc20TransfersQuery(
    () => ({
        hash: props.addressHash,
        _limit: MAX_ITEMS
    }),
    { notifyOnNetworkStatusChange: true }
)

const hasMore = computed<boolean>(() => {
    return result.value?.getERC20Transfers.nextKey !== null
})

const transferHistory = computed<Array<Transfer | null>>(() => result.value?.getERC20Transfers.transfers || [])

const transfers = computed<Array<Transfer | null>>(() => {
    if (transferHistory.value.length > 0) {
        const start = MAX_ITEMS * state.index
        const end = start + MAX_ITEMS > transferHistory.value?.length ? transferHistory.value?.length : start + MAX_ITEMS
        return transferHistory.value.slice(start, end)
    }
    return []
})

const tokenImg = computed<Map<string, TokenMarketData> | false>(() => {
    if (!loadingTransfers.value) {
        const contracts: string[] = []
        transferHistory.value.forEach(token => {
            if (token) {
                contracts.push(token.contract)
            }
        })
        if (contracts.length > 0) {
            return getEthereumTokensMap(contracts)
        }
    }
    return false
})

/**
 * Fetches image for the contract
 * @param contract {String}
 * @returns {TokenMarketData} or {undefined}
 */
const getImg = (contract: string): string | undefined => {
    if (!loadingTransfers.value && tokenImg.value && tokenImg.value.has(contract)) {
        const token = tokenImg.value.get(contract)
        return token?.image
    }
    return undefined
}

const transferType = (transfer: Transfer): string => {
    const from = transfer.transfer.from.toLowerCase()
    const to = transfer.transfer.to.toLowerCase()
    const addr = props.addressHash.toLowerCase()

    if (addr === from && addr === to) {
        return TYPES[2]
    } else if (addr === from) {
        return TYPES[1]
    }
    return TYPES[0]
}

const transferTypeAddress = (transfer: Transfer): string => {
    switch (transferType(transfer)) {
        case TYPES[0]:
            return transfer.transfer.from
        case TYPES[1]:
            return transfer.transfer.to
        default:
            return props.addressHash
    }
}

const getValue = (transfer: Transfer): BN => {
    let n = new BN(transfer.value)
    if (transfer.tokenInfo.decimals) {
        n = n.div(new BN(10).pow(transfer.tokenInfo.decimals))
    }
    return n
}

const getAmount = (transfer: Transfer) => {
    return formatFloatingPointValue(getValue(transfer))
}

const setPage = (page: number, reset = false) => {
    if (reset) {
        refetch()
        emit('resetCount')
    } else {
        if (page > state.index && hasMore.value) {
            fetchMore({
                variables: {
                    hash: props.addressHash,
                    _limit: MAX_ITEMS,
                    _nextKey: result.value?.getERC20Transfers?.nextKey
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    return {
                        getERC20Transfers: {
                            nextKey: fetchMoreResult?.getERC20Transfers.nextKey,
                            transfers: [...prev.getERC20Transfers.transfers, ...(fetchMoreResult?.getERC20Transfers.transfers || [])],
                            __typename: fetchMoreResult?.getERC20Transfers.__typename
                        }
                    }
                }
            })
        }
    }
    state.index = page
}
</script>
