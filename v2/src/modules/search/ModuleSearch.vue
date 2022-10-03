<template>
    <app-search
        :select-items="search.filterItems"
        :is-loading="isLoading"
        :has-error="hasError"
        :search-options="search.partialResults"
        @onSearch="executeSearch"
        @tokenSelected="routeToToken"
    >
        <template #search-results>
            <!-- 
                Search has Token result
            -->
            <v-list v-if="tokensResult.length > 0">
                <v-list-subheader>Tokens</v-list-subheader>
                <v-list-item
                    v-for="item in tokensResult"
                    :key="item.contract"
                    :title="item.text"
                    :subtitle="item.subtext"
                    class="overflow-hidden"
                    @click="routeToToken(item.contract)"
                >
                    <template #prepend>
                        <app-token-icon :token-icon="item.icon" class="mr-2"></app-token-icon>
                    </template>
                    <template #append> {{ item.price }} </template>
                </v-list-item>
            </v-list>
            <!-- 
                Search has Address result
            -->
            <v-list v-if="search.hashType === HASH_TYPE.AddressHash">
                <v-list-subheader>Address</v-list-subheader>
                <v-list-item :title="search.param" class="overflow-hidden" @click="routeTo(search.param)">
                    <template v-slot:prepend>
                        <app-address-blockie :address="search.param || ''" :size="6" class="mr-5" />
                    </template>
                </v-list-item>
            </v-list>
            <!-- 
                Search has Tx result
            -->
            <v-list v-if="search.hashType === HASH_TYPE.TxHash" lines="one">
                <v-list-subheader>Transaction hash:</v-list-subheader>
                <v-list-item :title="search.param" prepend-icon="image" class="overflow-hidden" singli @click="routeTo(search.param)"> </v-list-item>
            </v-list>
            <!-- 
                Search has Block result
            -->
            <v-list v-if="search.isBlockNumber || search.hashType === HASH_TYPE.BlockHash">
                <v-list-subheader>Block</v-list-subheader>
                <v-list-item prepend-icon="image" :title="search.param" class="overflow-hidden" @click="routeTo(search.param, true)"> </v-list-item>
            </v-list>
            <!-- 
                Search has Uncle result
            -->
            <v-list v-if="search.hashType === HASH_TYPE.UncleHash">
                <v-list-subheader>Uncle</v-list-subheader>
                <v-list-item prepend-icon="image" :title="search.param" class="overflow-hidden" @click="routeTo(search.param, true)"> </v-list-item>
            </v-list>
        </template>
    </app-search>
</template>

<script setup lang="ts">
import AppSearch from '@core/components/AppSearch.vue'
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import { SearchTokenOption } from '@core/components/props/index'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import { eth } from '@core/helper/eth'
import { reactive, watch, computed } from 'vue'
import { useGetHashTypeQuery, useGetTokensBeginsWithQuery } from './apollo/searchDetails.generated'
import { HashType } from '@/apollo/types'
import { ROUTE_NAME, ROUTE_PROP } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { Buffer } from 'buffer'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { tabViewRouteGuard } from '@/core/router/helpers'

/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

const HASH_TYPE = HashType
interface Search {
    filterItems: string[]
    param?: string
    enabledHashType: boolean
    enabledTokenSearch: boolean
    hasErrorHahType: boolean
    hasErrorTokenSearch: boolean
    partialResults: SearchTokenOption[]
    isBlockNumber: boolean
    hashType: string
}

const search: Search = reactive({
    enabledHashType: false,
    hasErrorHahType: false,
    hasErrorTokenSearch: false,
    enabledTokenSearch: false,
    partialResults: [],
    filterItems: ['All', 'Address', 'Transaction', 'Token', 'Block', 'Uncle'],
    isBlockNumber: false,
    hashType: ''
})
interface FilterRoutesMapInterface {
    [key: string]: {
        NAME: string
        PROP: string
    }
}
const filterRoutesMap: FilterRoutesMapInterface = {
    [HashType.AddressHash]: {
        NAME: ROUTE_NAME.ADDRESS.NAME,
        PROP: ROUTE_PROP.ADDRESS
    },
    [HashType.BlockHash]: {
        NAME: ROUTE_NAME.BLOCK_HASH.NAME,
        PROP: ROUTE_PROP.BLOCK
    },
    [HashType.TokenHash]: {
        NAME: ROUTE_NAME.TOKEN.NAME,
        PROP: ROUTE_PROP.TOKEN
    },
    [HashType.TxHash]: {
        NAME: ROUTE_NAME.TX_HASH.NAME,
        PROP: ROUTE_PROP.TX
    },
    [HashType.UncleHash]: {
        NAME: ROUTE_NAME.UNCLE_HASH.NAME,
        PROP: ROUTE_PROP.UNCLE
    }
}

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
 * Sets error and cancels loading
 * @param param {Any}
 */
// const setError = (isError = true): void => {
//     search.enabledHashType = false
//     search.enabledTokenSearch = false
//     search.isLoading = false
//     if (!search.isBlockNumber || search.hashType === '') {
//         console.log(search.hashType)
//         search.hasError = isError
//     }
// }
/**
 * Executes search functionality.
 * if searchParam is empty, aborts search
 * @param {string} searchParam - value to search
 * @param {string} filterParam -  value of the current seelcted filter
 */

const executeSearch = (searchParam: string, filterParam?: string): void => {
    search.enabledTokenSearch = false
    search.enabledHashType = false
    search.isBlockNumber = false
    search.hasErrorHahType = false
    search.hasErrorTokenSearch = false
    search.hashType = ''
    ///checks for string length
    if (Buffer.byteLength(searchParam, 'utf8') > 1024) {
        search.hasErrorHahType = true
        search.hasErrorHahType = true
    } else {
        const param = removeSpaces(searchParam)
        if (param.length > 0) {
            if (eth.isValidAddress(param) || eth.isValidHash(param)) {
                search.enabledHashType = true
                search.param = param
            } else {
                search.hasErrorHahType = true
            }
            if (eth.isValidBlockNumber(param)) {
                search.isBlockNumber = true
                search.param = param
                // router.push({ name: ROUTE_NAME.BLOCK_NUMBER.NAME, params: { [ROUTE_PROP.BLOCK]: param } })
            } else {
                search.isBlockNumber = false
            }
            // Search For Tokens:
            /// add search for market data first
            search.param = param
            search.enabledTokenSearch = true
        }
    }
}
/*
===================================================================================
    Fetch HasType
    If results are valid, reroutes user to the requested page
===================================================================================
*/
const {
    onResult: onHashTypeResult,
    onError: onHashTypeError,
    loading: loadingHashType
} = useGetHashTypeQuery(
    () => ({
        hash: search.param || ''
    }),
    () => ({
        enabled: search.enabledHashType,
        fetchPolicy: 'cache-and-network'
    })
)
const router = useRouter()

onHashTypeResult(({ data }) => {
    if (data && data.getHashType) {
        if (data.getHashType === HashType.CodeHash) {
            search.hasErrorHahType = true
        } else {
            search.hashType = data.getHashType
            console.log('Recieved', search.hashType)
            // const routeProp = `${search.param}`
            // try {
            //     router.push({ name: filterRoutesMap[data.getHashType].NAME, params: { [filterRoutesMap[data.getHashType].PROP]: routeProp } })
            // } catch (err) {
            //     //Catch on SENTRY
            // }
        }
    }
})
onHashTypeError(() => {
    search.hasErrorHahType = true
    search.enabledHashType = false
})
/**
 * Watching changes in the hashtype loading query
 * sets isLoading in search to give the proper ui responce
 *
 */
// watch(
//     () => loadingHashType,
//     newVal => {
//         search.isLoading = newVal.value
//     }
// )

/*
===================================================================================
    Fetches Possible token names from the user input
    Returns options to the child component
===================================================================================
*/
const { loading: loadingCoinData, getEthereumTokenByContract } = useCoinData()

const {
    onResult: onTokenSearchResult,
    onError: onTokenSearchError,
    loading: loadingTokenSearch
} = useGetTokensBeginsWithQuery(
    () => ({
        keyword: search.param || ''
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
                if (i) {
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
const tokensResult = computed(() => {
    if (!loadingCoinData.value && search.partialResults.length > 0) {
        const tokens = search.partialResults.map(i => {
            const marketData = getEthereumTokenByContract(i.contract)
            return {
                text: i.text,
                subtext: marketData ? marketData.symbol : i.contract,
                price: marketData ? marketData.current_price : undefined,
                icon: marketData ? marketData.image : undefined,
                contract: i.contract
            }
        })
        return tokens.sort((x, y) => (y.price! < x.price! ? -1 : y.price! > x.price ? 1 : 0))
    }
    return []
})

/**
 * Returns true if search results are empty
 */
const hasError = computed(() => {
    return search.hasErrorTokenSearch && search.hasErrorHahType && !search.isBlockNumber
})
/**
 * Returns true if search results are empty
 */
const isLoading = computed(() => {
    console.log('Loading', loadingTokenSearch.value || loadingHashType.value || loadingCoinData.value)
    return loadingCoinData.value || loadingHashType.value || loadingTokenSearch.value
})

/**
 * Routes to the token contract page
 * @param {string} contract - token contract address
 */
const routeToToken = (contract: string): void => {
    router.push({ name: ROUTE_NAME.TOKEN.NAME, params: { [ROUTE_PROP.TOKEN]: contract } })
}
const routeTo = (param: string, isBlock = false): void => {
    if (isBlock) {
        if (search.isBlockNumber) {
            router.push({ name: ROUTE_NAME.BLOCK_NUMBER.NAME, params: { [ROUTE_PROP.BLOCK]: param } })
        } else {
            const routeName = search.hashType === HASH_TYPE.BlockHash ? ROUTE_NAME.BLOCK_HASH.NAME : ROUTE_NAME.UNCLE_HASH.NAME
            const routeProp = search.hashType === HASH_TYPE.BlockHash ? ROUTE_PROP.BLOCK : ROUTE_PROP.UNCLE
            router.push({
                name: routeName,
                params: { [routeProp]: param }
            })
        }
    } else {
        if (search.hashType === HASH_TYPE.AddressHash) {
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

// const startSearch = (): void => {
//     if (!hasError.value) {
//        //Find First result in a list
//         if (tokensResult.value.length > 0) {

//        }
//     }
// }
</script>
