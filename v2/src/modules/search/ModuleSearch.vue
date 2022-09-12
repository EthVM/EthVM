<template>
    <app-search
        :select-items="search.filterItems"
        :is-loading="search.isLoading"
        :has-error="search.hasError"
        :search-options="search.partialResults"
        @onSearch="executeSearch"
        @tokenSelected="routeToToken"
    />
</template>

<script setup lang="ts">
import AppSearch from '@core/components/AppSearch.vue'
import { SearchTokenOption } from '@core/components/props/index'
import { eth } from '@core/helper/eth'
import { reactive, watch } from 'vue'
import { useGetHashTypeQuery, useGetTokensBeginsWithQuery } from './apollo/searchDetails.generated'
import { HashType } from '@/apollo/types'
import { ROUTE_NAME, ROUTE_PROP } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { Buffer } from 'buffer'

/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
interface Search {
    hasError?: boolean
    isLoading: boolean
    filterItems: string[]
    param?: string
    enabledHashType: boolean
    enabledTokenSearch: boolean
    partialResults: SearchTokenOption[]
}

const search: Search = reactive({
    hasError: false,
    isLoading: false,
    enabledHashType: false,
    enabledTokenSearch: false,
    partialResults: [],
    filterItems: ['All', 'Address', 'Transaction', 'Token', 'Block', 'Uncle']
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
const setError = (isError = true): void => {
    search.enabledHashType = false
    search.enabledTokenSearch = false
    search.hasError = isError
    search.isLoading = false
}
/**
 * Executes search functionality.
 * if searchParam is empty, aborts search
 * @param {string} searchParam - value to search
 * @param {string} filterParam -  value of the current seelcted filter
 */

const executeSearch = (searchParam: string, filterParam?: string): void => {
    search.hasError = false
    search.enabledTokenSearch = false
    search.enabledHashType = false
    ///checks for string length
    if (Buffer.byteLength(searchParam, 'utf8') > 1024) {
        setError()
    } else {
        const param = removeSpaces(searchParam)
        if (param.length > 0) {
            if (eth.isValidAddress(param) || eth.isValidHash(param)) {
                search.enabledHashType = true
                search.param = param
                return
            }
            if (filterParam === search.filterItems[4] && eth.isValidBlockNumber(param)) {
                router.push({ name: ROUTE_NAME.BLOCK_NUMBER.NAME, params: { [ROUTE_PROP.BLOCK]: param } })
                return
            }
            // Search For Tokens:
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
    // onError: onHashTypeError,
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
            setError()
        } else {
            const routeProp = `${search.param}`
            try {
                router.push({ name: filterRoutesMap[data.getHashType].NAME, params: { [filterRoutesMap[data.getHashType].PROP]: routeProp } })
            } catch (err) {
                //Catch on SENTRY
            }
        }
    }
})
// onHashTypeError(error => {
//     const newError = JSON.stringify(error.message)
// })
/**
 * Watching changes in the hashtype loading query
 * sets isLoading in search to give the proper ui responce
 *
 */
watch(
    () => loadingHashType,
    newVal => {
        search.isLoading = newVal.value
    }
)

/*
===================================================================================
    Fetches Possible token names from the user input
    Returns options to the child component
===================================================================================
*/
const { onResult: onTokenSearchResult } = useGetTokensBeginsWithQuery(
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
            setError()
        }
    }
})
/**
 * Routes to the token contract page
 * @param {string} contract - token contract address
 */
const routeToToken = (contract: string): void => {
    router.push({ name: ROUTE_NAME.TOKEN.NAME, params: { [ROUTE_PROP.TOKEN]: contract } })
}
</script>
