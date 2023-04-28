<template>
    <search-core-input :is-loading="isLoading" :has-error="hasError" @onUserInput="executeSearch" @tokenSelected="routeToToken" @onSearchEnter="routeToFirst">
        <template #search-results>
            <!--
                Search has Address result
            -->
            <v-list v-if="search.hashType === HASH_TYPE.AddressHash || search.hashType === HASH_TYPE.TokenHash || searchSavedNames.length > 0 || resolvedAdr">
                <v-list-subheader>Address</v-list-subheader>
                <v-list-item
                    v-if="resolvedAdr"
                    :title="search.param.toLowerCase()"
                    :subtitle="eth.toCheckSum(resolvedAdr)"
                    class="overflow-hidden"
                    @click="routeTo(resolvedAdr)"
                    :active="tokensResult.length === 0"
                >
                    <template v-slot:prepend>
                        <app-address-blockie :address="resolvedAdr" :size="7" class="mr-2" />
                    </template>
                </v-list-item>
                <template v-else-if="searchSavedNames.length > 0">
                    <v-list-item
                        v-for="hash in searchSavedNames"
                        :key="hash"
                        :title="store.getAddressName(hash)"
                        :subtitle="eth.toCheckSum(removeSpaces(hash))"
                        class="overflow-hidden"
                        @click="routeTo(hash)"
                        :active="tokensResult.length === 0"
                    >
                        <template v-slot:prepend>
                            <app-address-blockie :address="hash || ''" :size="7" class="mr-2" />
                        </template>
                    </v-list-item>
                </template>

                <v-list-item
                    v-else
                    :title="eth.toCheckSum(removeSpaces(search.param))"
                    :subtitle="store.getAddressName(search.param)"
                    class="overflow-hidden"
                    @click="routeTo(search.param)"
                    :active="tokensResult.length === 0"
                >
                    <template v-slot:prepend>
                        <app-address-blockie :address="search.param || ''" :size="7" class="mr-2" />
                    </template>
                </v-list-item>
            </v-list>
            <!--
                Search has Token result
            -->
            <v-list v-if="tokensResult.length > 0">
                <v-list-subheader>Tokens</v-list-subheader>
                <v-list-item
                    v-for="(item, index) in tokensResult"
                    :key="`${item.contract}+${index}`"
                    :title="item.text || ''"
                    :subtitle="item.subtext?.toUpperCase() || ''"
                    class="overflow-hidden"
                    :active="index === 0"
                    @click="routeToToken(item.contract || '')"
                >
                    <template #prepend>
                        <app-token-icon :token-icon="item.icon || undefined" class="mr-2"></app-token-icon>
                    </template>
                    <template #append v-if="item.price">
                        <p class="pl-6">{{ item.price }}</p></template
                    >
                </v-list-item>
            </v-list>
            <!--
                Search has Tx result
            -->
            <v-list v-if="search.hashType === HASH_TYPE.TxHash" lines="one">
                <v-list-subheader>Transaction</v-list-subheader>
                <v-list-item
                    :title="removeSpaces(search.param)"
                    prepend-icon="image"
                    class="overflow-hidden"
                    singli
                    @click="routeTo(search.param)"
                    :active="tokensResult.length === 0"
                >
                </v-list-item>
            </v-list>
            <!--
                Search has Block result
            -->
            <v-list v-if="search.isBlockNumber || search.hashType === HASH_TYPE.BlockHash">
                <v-list-subheader>Block</v-list-subheader>
                <v-list-item
                    prepend-icon="image"
                    :title="formatNumber(Number(removeSpaces(search.param).replace(/[_,\s]/g, '')))"
                    class="overflow-hidden"
                    @click="routeTo(removeSpaces(search.param).replace(/[_,\s]/g, ''), true)"
                    :active="tokensResult.length === 0"
                >
                </v-list-item>
            </v-list>
            <!--
                Search has Uncle result
            -->
            <v-list v-if="search.hashType === HASH_TYPE.UncleHash">
                <v-list-subheader>Uncle</v-list-subheader>
                <v-list-item
                    prepend-icon="image"
                    :title="removeSpaces(search.param)"
                    class="overflow-hidden"
                    @click="routeTo(search.param, true)"
                    :active="tokensResult.length === 0"
                >
                </v-list-item>
            </v-list>
        </template>
    </search-core-input>
</template>

<script setup lang="ts">
import SearchCoreInput from '@/modules/search/components/SearchCoreInput.vue'
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import { SearchTokenOption } from '@core/components/props/index'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import { eth } from '@core/helper/eth'
import { reactive, watch, computed, ref, Ref } from 'vue'
import { useGetHashTypeQuery, useGetTokensBeginsWithQuery } from './apollo/searchDetails.generated'
import { HashType } from '@/apollo/types'
import { Q_TOKEN_DETAILS, ROUTE_NAME, ROUTE_PROP } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { Buffer } from 'buffer'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { formatUsdValue, formatNumber } from '@/core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useGetTokenInfoByContractQuery } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { useResolveName } from '@/core/composables/ResolveName/useResolveName'
import { useStore } from '@/store'
import { PortfolioItem } from '@/store/helpers'
import { searchHelper } from '@core/helper/search'
/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
const store = useStore()
const HASH_TYPE = HashType
interface Search {
    param: string
    enabledHashType: boolean
    enabledTokenSearch: boolean
    hasErrorHahType: boolean
    hasErrorTokenSearch: boolean
    partialResults: SearchTokenOption[]
    isBlockNumber: boolean
    hashType: string
    reroute: boolean
}

const search: Search = reactive({
    enabledHashType: false,
    hasErrorHahType: false,
    hasErrorTokenSearch: false,
    enabledTokenSearch: false,
    partialResults: [],
    isBlockNumber: false,
    hashType: '',
    reroute: false,
    param: ''
})

const resolveName: Ref<string | undefined> = ref(undefined)
const { resolvedAdr, loading: isLoadingResolver } = useResolveName(resolveName)

/*
===================================================================================
    HELPERS
===================================================================================
*/
/**
 * Removes spaces from val
 * @param val {Any}
 */
const removeSpaces = (val: string): string => {
    if (val) {
        return val.replace(/ /g, '')
    }
    return ''
}

/**
 * Executes search functionality.
 * if searchParam is empty, aborts search
 * @param {string} searchParam - value to search
 */

const executeSearch = (searchParam: string): void => {
    search.enabledTokenSearch = false
    search.enabledHashType = false
    search.isBlockNumber = false
    search.hasErrorHahType = false
    search.hasErrorTokenSearch = false
    search.hashType = ''
    resolveName.value = undefined
    // checks for string length
    if (Buffer.byteLength(searchParam, 'utf8') > 1024) {
        search.hasErrorHahType = true
        search.hasErrorTokenSearch = true
    } else {
        const param = searchParam
        if (param.length > 0) {
            if (eth.isValidAddress(removeSpaces(param.toLowerCase())) || eth.isValidHash(removeSpaces(param.toLowerCase()))) {
                search.param = param
                search.enabledHashType = true
            } else {
                search.hasErrorHahType = true
            }
            if (eth.isValidBlockNumber(removeSpaces(param).replace(/[_,\s]/g, ''))) {
                search.isBlockNumber = true
                search.param = param
            } else {
                search.isBlockNumber = false
            }
            if (!eth.isValidBlockNumber(removeSpaces(param)) && !eth.isValidHash(removeSpaces(param.toLowerCase()))) {
                resolveName.value = removeSpaces(param)
            }
            search.param = param
            // Search For Tokens:
            search.enabledTokenSearch = true
        }
    }
}

const searchSavedNames = computed<string[]>(() => {
    let _items: PortfolioItem[] = []
    const _list = [...store.portfolio, ...store.adrBook]
    if (search.param !== '') {
        _items = searchHelper(_list, ['name', 'hash'], search.param) as PortfolioItem[]
    } else {
        _items = _list
    }
    return _items.map(i => i.hash).slice(0, 5)
})
/*
===================================================================================
    Fetch HashType
    If results are valid, reroutes user to the requested page
===================================================================================
*/
const {
    onResult: onHashTypeResult,
    onError: onHashTypeError,
    loading: loadingHashType
} = useGetHashTypeQuery(
    () => ({
        hash: removeSpaces(search.param)
    }),
    () => ({
        enabled: search.enabledHashType,
        fetchPolicy: 'cache-and-network'
    })
)

onHashTypeResult(({ data }) => {
    if (data && data.getHashType) {
        if (data.getHashType === HashType.CodeHash) {
            search.hasErrorHahType = true
        } else {
            search.hashType = data.getHashType
        }
    }
})

onHashTypeError(() => {
    search.hasErrorHahType = true
    search.enabledHashType = false
})

/*
===================================================================================
    Fetches Possible token names from the user input from the backend
===================================================================================
*/
const { loading: loadingCoinData, getEthereumTokenByContract, tokensWithMarketCap } = useCoinData()

const {
    onResult: onTokenSearchResult,
    onError: onTokenSearchError,
    loading: loadingTokenSearch
} = useGetTokensBeginsWithQuery(
    () => ({
        keyword: search.param
    }),
    () => ({
        enabled: search.enabledTokenSearch,
        fetchPolicy: 'cache-and-network'
    })
)

onTokenSearchResult(({ data }) => {
    if (data && data.getTokensBeginsWith) {
        if (data.getTokensBeginsWith.length > 0) {
            search.partialResults = []
            data.getTokensBeginsWith.forEach(i => {
                const isNotDuplicate = search.partialResults.find(item => item.contract === i?.contract) === undefined
                if (i && isNotDuplicate) {
                    search.partialResults.push({
                        text: i.keyword,
                        contract: i.contract
                    })
                }
            })
        } else {
            search.partialResults = []
            search.hasErrorTokenSearch = true
        }
    }
})
onTokenSearchError(() => {
    search.hasErrorTokenSearch = true
})

/*
===================================================================================
    Tokens Result Handling
    Returns options to the child component

===================================================================================
*/

/**
 * Computed property that returns results into the search component list.
 * Filters results in the market data by match.
 * Removes duplicates from the tokens search result and market data.
 * Flags elements that begins with the search param
 * Returns Result in this order: items that have market data and begins with search param, them partial matches with market data, everything else
 */
const tokensResult = computed(() => {
    if (!loadingCoinData.value) {
        // Check if hash is of type TOKEN_HASH and get token from tokenMarketInfo
        if (search.hashType === HashType.TokenHash) {
            const token = getEthereumTokenByContract(search.param)
            if (token) {
                return [
                    {
                        text: token.name,
                        subtext: token.symbol ? token.symbol : token.contract,
                        price: token.current_price ? formatUsdValue(new BN(token.current_price)).value : undefined,
                        icon: token.image,
                        contract: eth.toCheckSum(token.contract || '')
                    }
                ]
            }
            if (!token) {
                const { result: tokenInfo } = useGetTokenInfoByContractQuery(() => ({
                    contract: search.param
                }))

                const tokenInfoDetails = tokenInfo.value?.getTokenInfoByContract
                if (tokenInfoDetails) {
                    return [
                        {
                            text: tokenInfoDetails.name,
                            subtext: tokenInfoDetails.symbol ? tokenInfoDetails.symbol : eth.toCheckSum(tokenInfoDetails.contract),
                            contract: eth.toCheckSum(tokenInfoDetails.contract || ''),
                            icon: undefined
                        }
                    ]
                }
            }
            return [
                {
                    text: 'No Name',
                    subtext: eth.toCheckSum(search.param),
                    contract: eth.toCheckSum(search.param),
                    icon: undefined
                }
            ]
        }
        const tokensInMarket = tokensWithMarketCap.value
            .filter(i => i.symbol.toLowerCase().includes(search.param.toLowerCase()) || i.name.toLowerCase().includes(search.param.toLowerCase()))
            .map(i => {
                const flag = i.name.toLowerCase().startsWith(search.param) || i.symbol.toLowerCase().startsWith(search.param)
                return {
                    text: i.name,
                    subtext: i.symbol ? i.symbol : eth.toCheckSum(i.contract || ''),
                    price: i.current_price ? formatUsdValue(new BN(i.current_price)).value : undefined,
                    icon: i.image,
                    contract: i.contract,
                    flag: flag
                }
            })
            .slice(0, 9)
        const tokenFromPartialResult = search.partialResults
            .filter(i => {
                const exhists = tokensInMarket.find(market => market?.contract === i.contract)
                return exhists === undefined
            })
            .map(i => {
                const marketData = getEthereumTokenByContract(i.contract)
                return {
                    text: i.text,
                    subtext: marketData ? marketData.symbol : eth.toCheckSum(i.contract),
                    price: marketData && marketData.current_price ? formatUsdValue(new BN(marketData.current_price)).value : undefined,
                    icon: marketData ? marketData.image : undefined,
                    contract: i.contract,
                    flag: marketData !== false
                }
            })
        const flagged = [...tokensInMarket.filter(i => i.flag), ...tokenFromPartialResult.filter(i => i.flag)]
        const notFlagged = [...tokensInMarket.filter(i => !i.flag), ...tokenFromPartialResult.filter(i => !i.flag)]
        return [...flagged, ...notFlagged]
    }
    return []
})

/*
===================================================================================
   Module Error and Loading
===================================================================================
*/

/**
 * Returns true if search results are empty
 */
const hasError = computed(() => {
    return (
        search.hasErrorTokenSearch &&
        search.hasErrorHahType &&
        !search.isBlockNumber &&
        tokensResult.value.length === 0 &&
        resolvedAdr.value === undefined &&
        searchSavedNames.value.length < 1
    )
})
/**
 * Returns true if search is loading
 */
const isLoading = computed(() => {
    return loadingCoinData.value || loadingHashType.value || loadingTokenSearch.value || isLoadingResolver.value
})

/**
 * Watching changes in the hashtype loading query
 * If User pressed enter on load finish will reroute to the first result in the shown results
 */
watch(
    () => isLoading.value,
    newVal => {
        if (!newVal && search.reroute) {
            search.reroute = false
            routeToFirst(search.param)
        }
    }
)

/*
===================================================================================
    Routing
===================================================================================
*/

const router = useRouter()

/**
 * Routes to the token contract page
 * @param {string} contract - token contract address
 */
const routeToToken = (contract: string): void => {
    if (contract !== '') {
        router.push({
            name: ROUTE_NAME.TOKEN.NAME,
            params: {
                [ROUTE_PROP.TOKEN]: contract
            },
            query: { t: Q_TOKEN_DETAILS[0] }
        })
    }
}

/**
 * Routes to the hashType
 * @param {string} contract - token contract address
 */
const routeTo = (_param: string, isBlock = false): void => {
    const param = removeSpaces(_param)
    if (isBlock) {
        if (search.isBlockNumber) {
            router.push({
                name: ROUTE_NAME.BLOCK_NUMBER.NAME,
                params: { [ROUTE_PROP.BLOCK]: param }
            })
        } else {
            const routeName = search.hashType === HASH_TYPE.BlockHash ? ROUTE_NAME.BLOCK_HASH.NAME : ROUTE_NAME.UNCLE_HASH.NAME
            const routeProp = search.hashType === HASH_TYPE.BlockHash ? ROUTE_PROP.BLOCK : ROUTE_PROP.UNCLE
            router.push({
                name: routeName,
                params: { [routeProp]: param }
            })
        }
    } else {
        if (search.hashType === HASH_TYPE.AddressHash || search.hashType === HASH_TYPE.TokenHash || resolvedAdr.value) {
            router.push({
                name: ROUTE_NAME.ADDRESS.NAME,
                params: { [ROUTE_PROP.ADDRESS]: param }
            })
        }
        if (search.hashType === HASH_TYPE.TxHash) {
            router.push({
                name: ROUTE_NAME.TX_HASH.NAME,
                params: { [ROUTE_PROP.TX]: param }
            })
        }
    }
}

/**
 * Routes to the first result loaded
 * @param {string} param - search param
 */
const routeToFirst = (param: string): void => {
    if (param !== '') {
        if (!hasError.value && !isLoading.value) {
            //Find First result in a list
            if (tokensResult.value.length > 0 && tokensResult.value[0].contract) {
                routeToToken(tokensResult.value[0].contract)
            } else {
                const isBlock = search.isBlockNumber || search.hashType === HASH_TYPE.BlockHash || search.hashType === HASH_TYPE.UncleHash
                const _route = resolvedAdr.value ? resolvedAdr.value : param
                routeTo(_route, isBlock)
            }
        } else if (isLoading.value && !hasError.value) {
            search.reroute = true
        }
    }
}
</script>
