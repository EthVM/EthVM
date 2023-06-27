<template>
    <search-core-input
        :is-loading="isLoading"
        :has-error="hasError"
        @onUserInput="executeSearch"
        @tokenSelected="routeToToken"
        @onSearchEnter="routeToSelected"
        @menuArrowPress="selectItems"
    >
        <template #search-results>
            <v-list lines="one">
                <!--
                    Search has Address result
                -->
                <template
                    v-if="search.hashType === HASH_TYPE.AddressHash || search.hashType === HASH_TYPE.TokenHash || searchSavedNames.length > 0 || resolvedAdr"
                >
                    <v-list-subheader>{{ $t('common.address', 1) }}</v-list-subheader>
                    <!--
                        Resolved Adr
                    -->
                    <v-list-item
                        v-if="resolvedAdr"
                        :title="search.param.toLowerCase()"
                        :subtitle="eth.toCheckSum(resolvedAdr)"
                        class="overflow-hidden"
                        @click="routeTo(resolvedAdr)"
                        :id="SELECTED_LISTS[0]"
                        :active="SELECTED_LISTS[0] === search.selectedId"
                    >
                        <template v-slot:prepend>
                            <app-address-blockie :address="resolvedAdr" :size="7" class="mr-2" />
                        </template>
                    </v-list-item>
                    <!--
                        Saved Names
                    -->
                    <template v-else-if="searchSavedNames.length > 0">
                        <v-list-item
                            v-for="(hash, index) in searchSavedNames"
                            :key="hash"
                            :title="store.getAddressName(hash)"
                            :subtitle="eth.toCheckSum(removeSpaces(hash))"
                            class="overflow-hidden"
                            @click="routeTo(hash)"
                            :id="`${SELECTED_LISTS[1]}-${index}`"
                            :active="`${SELECTED_LISTS[1]}-${index}` === search.selectedId"
                        >
                            <template v-slot:prepend>
                                <app-address-blockie :address="hash || ''" :size="7" class="mr-2" />
                            </template>
                        </v-list-item>
                    </template>
                    <!--
                        Address 
                    -->
                    <v-list-item
                        v-else
                        :title="eth.toCheckSum(removeSpaces(search.param))"
                        :subtitle="store.getAddressName(search.param)"
                        class="overflow-hidden"
                        @click="routeTo(search.param)"
                        :id="SELECTED_LISTS[2]"
                        :active="SELECTED_LISTS[2] === search.selectedId"
                    >
                        <template v-slot:prepend>
                            <app-address-blockie :address="search.param || ''" :size="7" class="mr-2" />
                        </template>
                    </v-list-item>
                </template>
                <!--
                    Search has Token result
                -->
                <template v-if="tokensResult.length > 0">
                    <v-list-subheader>{{ $t('common.token', 2) }}</v-list-subheader>
                    <v-list-item
                        v-for="(item, index) in tokensResult"
                        :key="`${item.contract}+${index}`"
                        :title="item.text || ''"
                        :subtitle="item.subtext?.toUpperCase() || ''"
                        class="overflow-hidden"
                        :id="`${SELECTED_LISTS[3]}-${index}`"
                        :active="`${SELECTED_LISTS[3]}-${index}` === search.selectedId"
                        @click="routeToToken(item.contract || '')"
                    >
                        <template #prepend>
                            <app-token-icon :token-icon="item.icon || undefined" class="mr-2"></app-token-icon>
                        </template>
                        <template #append v-if="item.price">
                            <p class="pl-6">{{ item.price }}</p></template
                        >
                    </v-list-item>
                </template>
                <!--
                    Search has Tx result
                -->
                <template v-if="search.hashType === HASH_TYPE.TxHash">
                    <v-list-subheader>{{ $t('txs.name', 1) }}</v-list-subheader>
                    <v-list-item
                        :title="removeSpaces(search.param)"
                        prepend-icon="sync_alt"
                        class="overflow-hidden"
                        singli
                        @click="routeTo(search.param)"
                        :id="SELECTED_LISTS[4]"
                        :active="SELECTED_LISTS[4] === search.selectedId"
                    >
                    </v-list-item>
                </template>
                <!--
                Search has Block result
                -->
                <template v-if="search.isBlockNumber || search.hashType === HASH_TYPE.BlockHash">
                    <v-list-subheader>{{ $t('common.block', 2) }}</v-list-subheader>
                    <v-list-item
                        prepend-icon="widgets"
                        :title="formatNumber(Number(removeSpaces(search.param).replace(/[_,\s]/g, '')))"
                        class="overflow-hidden"
                        @click="routeTo(removeSpaces(search.param).replace(/[_,\s]/g, ''), true)"
                        :id="SELECTED_LISTS[5]"
                        :active="SELECTED_LISTS[5] === search.selectedId"
                    >
                    </v-list-item>
                </template>
                <!--
                    Search has Uncle result
                -->
                <template v-if="search.hashType === HASH_TYPE.UncleHash">
                    <v-list-subheader>{{ $t('block.uncle', 1) }}</v-list-subheader>
                    <v-list-item
                        prepend-icon="widgets"
                        :title="removeSpaces(search.param)"
                        class="overflow-hidden"
                        @click="routeTo(search.param, true)"
                        :id="SELECTED_LISTS[6]"
                        :active="SELECTED_LISTS[6] === search.selectedId"
                    >
                    </v-list-item>
                </template>
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
import { reactive, watch, computed, ref, Ref, nextTick } from 'vue'
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

const SELECTED_LISTS = ['resolvedAdr', 'savedAdr', 'adr', 'tokens', 'tx', 'block', 'uncle']
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
    selectedId?: string
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
            routeToSelected(search.param)
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
        if (search.hashType === HASH_TYPE.AddressHash || search.hashType === HASH_TYPE.TokenHash || searchSavedNames.value.length > 0 || resolvedAdr.value) {
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
const routeToSelected = (param: string): void => {
    if (param !== '') {
        if (!hasError.value && !isLoading.value) {
            //Find First result in a list
            if (search.selectedId === SELECTED_LISTS[0] || search.selectedId === SELECTED_LISTS[2] || search.selectedId?.includes(SELECTED_LISTS[1])) {
                let adr = ''
                if (search.selectedId?.includes(SELECTED_LISTS[1])) {
                    const index = parseInt(search.selectedId.substring(9))
                    adr = searchSavedNames.value[index]
                } else {
                    adr = search.selectedId === SELECTED_LISTS[0] && resolvedAdr.value ? resolvedAdr.value : param
                }
                routeTo(adr, false)
            } else if (search.selectedId?.includes(SELECTED_LISTS[3])) {
                const index = parseInt(search.selectedId.substring(7))
                const contract = tokensResult.value[index].contract
                if (contract) {
                    routeToToken(contract)
                }
            } else {
                const isBlock = search.isBlockNumber || search.hashType === HASH_TYPE.BlockHash || search.hashType === HASH_TYPE.UncleHash
                routeTo(param, isBlock)
            }
        } else if (isLoading.value && !hasError.value) {
            search.reroute = true
        }
    }
}
/*
===================================================================================
    Select Items. Items Slected reset to first every time new user input comes in

    ITEMS ORDER Display and triversal:
    1. Resolved Address
    2. N saved Addresses
    3. Found Address
    4. N Token Results
    5. Tx
    6. Block
    7. Uncles
===================================================================================
*/

const itemsInSelect = computed<string[]>(() => {
    const items: string[] = []
    if (resolvedAdr.value) {
        items.push(SELECTED_LISTS[0])
    }
    if (searchSavedNames.value.length > 0) {
        searchSavedNames.value.forEach((i, index) => {
            items.push(`${SELECTED_LISTS[1]}-${index}`)
        })
    }
    if (search.hashType === HASH_TYPE.AddressHash || search.hashType === HASH_TYPE.TokenHash) {
        items.push(SELECTED_LISTS[2])
    }
    if (tokensResult.value.length > 0) {
        tokensResult.value.forEach((i, index) => {
            items.push(`${SELECTED_LISTS[3]}-${index}`)
        })
    }
    if (search.hashType === HASH_TYPE.TxHash) {
        items.push(SELECTED_LISTS[4])
    }
    if (search.isBlockNumber || search.hashType === HASH_TYPE.BlockHash) {
        items.push(SELECTED_LISTS[5])
    }
    if (search.hashType === HASH_TYPE.UncleHash) {
        items.push(SELECTED_LISTS[6])
    }
    return items
})
/**
 * Watching changes in the itemsInSelect
 * Sets First element to be selected
 * Resets selcts if results are empty
 */
watch(
    () => itemsInSelect.value,

    newVal => {
        if (newVal && itemsInSelect.value.length > 0) {
            search.selectedId = itemsInSelect.value[0]
        } else {
            search.selectedId = undefined
        }
    },
    { deep: true }
)

const selectItems = (direction: string) => {
    if (itemsInSelect.value.length > 0) {
        if (!search.selectedId) {
            search.selectedId = itemsInSelect.value[0]
        } else {
            const index = itemsInSelect.value.findIndex(i => i === search.selectedId)
            const next = direction === 'down' ? index + 1 : index - 1
            if (next === itemsInSelect.value.length) {
                search.selectedId = itemsInSelect.value[0]
            } else if (next < 0) {
                search.selectedId = itemsInSelect.value[itemsInSelect.value.length - 1]
            } else {
                search.selectedId = itemsInSelect.value[next]
            }
        }
        const el = document.getElementById(search.selectedId)
        if (el) {
            const blockVal =
                search.selectedId === itemsInSelect.value[0] || search.selectedId === itemsInSelect.value[itemsInSelect.value.length - 1] ? 'center' : 'nearest'
            nextTick(() => {
                el.scrollIntoView({ behavior: 'smooth', block: blockVal, inline: 'nearest' })
            })
        }
    }
}
</script>
