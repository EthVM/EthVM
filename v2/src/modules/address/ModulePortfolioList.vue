<template>
    <div class="pa-4 pa-sm-6">
        <module-add-adress-to-porfolio address="0xC5cA2Dd997E7Aa97f2DE490e329578Be27e9E644" />
        {{ store.portfolioLength }}
        <!--Table Header-->
        <v-row :dense="xs" :class="'mt-sm-4 d-flex text-body-1 text-info mb-sm-3'" :justify="xs ? 'end' : 'start'">
            <v-col sm="5" md="4" class="py-0 d-none d-sm-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.HASH)">
                    Address <v-icon v-if="isActiveSort(KEY.HASH)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
            <v-col sm="7" md="8" class="d-none d-sm-flex">
                <v-row>
                    <!--
                        NAME:
                        hidden on xs-md
                    -->
                    <v-col lg="3" class="py-0 d-none d-lg-block">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.NAME)">
                            Name <v-icon v-if="isActiveSort(KEY.NAME)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-col>
                    <!--
                        ETH Balance:
                        hidden on xs
                    -->
                    <v-col sm="6" md="4" lg="3" class="py-0 d-none d-sm-block">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.ETH)">
                            ETH Balance <v-icon v-if="isActiveSort(KEY.ETH)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-col>
                    <!--
                        ETH Value:
                        hidden on xs-sm
                    -->
                    <v-col md="4" lg="3" class="py-0 d-none d-md-block">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.ETH_USD)">
                            ETH Value <v-icon v-if="isActiveSort(KEY.ETH_USD)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-col>
                    <!--
                        total:
                        hidden on xs
                    -->
                    <v-col sm="6" md="4" lg="3" class="py-0 d-none d-sm-block">
                        <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.TOTAL)">
                            Total <v-icon v-if="isActiveSort(KEY.TOTAL)" class="ml-1" size="x-small">{{ sortIcon }}</v-icon></v-btn
                        >
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-divider class="mx-n4 mx-sm-n6 mb-5" />
        <template v-if="addressList.length > 0">
            <div v-for="adr in sortList" :key="adr.hash">
                <v-row :dense="xs" class="d-flex align-start align-lg-center text-body-1 mt-0 mb-5" :justify="xs ? 'end' : 'start'">
                    <v-col xs="6" sm="5" md="4" class="py-0 d-flex align-center">
                        <module-add-adress-to-porfolio :address="adr.hash" />
                        <app-address-blockie :address="adr.hash" class="ml-5 mr-4" />
                        <div v-if="mdAndDown">
                            <p>{{ adr.name }}</p>
                            <app-transform-hash :hash="eth.toCheckSum(adr.hash)" :link="`address/${adr.hash}`" is-blue is-short />
                        </div>
                        <app-transform-hash v-else :hash="eth.toCheckSum(adr.hash)" :link="`address/${adr.hash}`" is-blue class="mr-16" />
                    </v-col>
                    <v-col xs="6" sm="7" md="8">
                        <v-row>
                            <!--
                        NAME:
                        hidden on xs-md
                    -->
                            <v-col lg="3" class="py-0 d-none d-lg-flex align-center">
                                <p>{{ adr.name }}</p>
                                <module-add-adress-to-porfolio :address="adr.hash" :name="adr.name" is-edit-mode />
                            </v-col>
                            <!--
                        ETH Balance:
                        hidden on xs
                    -->
                            <v-col sm="6" md="4" lg="3" class="py-0 d-none d-sm-block d-lg-flex align-lg-center">
                                <div v-if="adr.eth">
                                    <p>{{ adr.eth }}</p>
                                    <p v-if="smAndDown" class="text-info">{{ adr.ethUSD }}</p>
                                </div>
                                <div v-else class="skeleton-box rounded-xl" style="height: 20px; width: 60%"></div>
                            </v-col>
                            <!--
                        ETH Value:
                        hidden on xs-sm
                    -->
                            <v-col md="4" lg="3" class="py-0 d-none d-md-block d-lg-flex align-lg-center">
                                <p v-if="adr.ethUSD">{{ adr.ethUSD }}</p>
                                <div v-else class="skeleton-box rounded-xl" style="height: 20px; width: 60%"></div>
                            </v-col>
                            <!--
                        total:
                        hidden on xs
                    -->
                            <v-col xs="12" sm="6" md="4" lg="3" class="py-0 d-lg-flex align-lg-center">
                                <p v-if="adr.total" class="text-right text-sm-left">{{ adr.total }}</p>
                                <div v-else class="skeleton-box rounded-xl" style="height: 20px; width: 60%"></div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </div>
        </template>

        <template v-else>
            <app-no-result :text="`Your portfolio is empty`"></app-no-result>
        </template>
        <!--  -->
    </div>
</template>

<script setup lang="ts">
import ModuleAddAdressToPorfolio from './ModuleAddAdressToPorfolio.vue'
import AppInput from '@core/components/AppInput.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppNoResult from '@core/components/AppNoResult.vue'
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { eth } from '@core/helper/eth'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatUsdValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'

const { xs, smAndDown, mdAndDown } = useDisplay()
const store = useStore()

enum KEY {
    NAME = 'name',
    HASH = 'hash',
    ETH = 'weiBN',
    ETH_USD = 'ethUSDBN',
    TOTAL = 'totalBN',
    EMPTY = ''
}
const DIRECTION = {
    HIGH: 'HIGH',
    LOW: 'LOW'
}

/** -------------------
 * Display List  Handler
 ---------------------*/
/**
 * Checks if name is new
 * @param _value user input
 */

interface DisplayItem {
    name: string
    hash: string
    eth?: string
    ethUSD?: string
    total?: string
    weiBN?: BN
    ethUSDBN?: BN
    totalBN?: BN
}

const addressList = computed<DisplayItem[]>(() => {
    return store.portfolio.map(i => {
        const isLoaded = store.addressEthBalanceLoaded(i.hash)
        const cleanHash = i.hash.toLocaleLowerCase()
        const total = store.addressTotalBalance(cleanHash)
        return {
            name: i.name,
            hash: i.hash,
            eth: isLoaded ? store.portfolioEthBalanceMap[cleanHash].balanceFormatted : undefined,
            ethUSD: isLoaded ? store.portfolioEthBalanceMap[cleanHash].balanceFiatFormatted : undefined,
            total: total ? formatUsdValue(total).value : undefined,
            weiBN: isLoaded ? store.portfolioEthBalanceMap[cleanHash].weiBalance : undefined,
            ethUSDBN: isLoaded ? store.portfolioEthBalanceMap[cleanHash].balanceFiatBN : undefined,
            totalBN: total
        }
    })
})

/** -------------------
 * Sort
 ---------------------*/
interface ComponentState {
    sortKey: KEY
    direction: string
}

const state: ComponentState = reactive({
    sortKey: KEY.EMPTY,
    direction: DIRECTION.HIGH
})

const sortIcon = computed<string>(() => {
    return state.direction.includes(DIRECTION.HIGH) ? 'south' : 'north'
})

const isActiveSort = (key: KEY): boolean => {
    return state.sortKey.includes(key)
}

const sortList = computed<DisplayItem[]>(() => {
    if (store.portfolioIsLoaded && state.sortKey !== KEY.EMPTY) {
        const sorted = new Sorted(addressList.value, state.sortKey)
        return state.direction.includes(DIRECTION.HIGH) ? sorted.getDesend() : sorted.getAscend()
    }
    return addressList.value
})

const sortTable = (key: KEY) => {
    if (state.sortKey === key) {
        state.direction = state.direction.includes(DIRECTION.HIGH) ? DIRECTION.LOW : DIRECTION.HIGH
    } else {
        state.sortKey = key
    }
}

interface SortedInterface {
    key: KEY
    ascend: any[]
    desend: any[]
}

class Sorted<DisplayItem> implements SortedInterface {
    /* Properties: */
    key: KEY
    ascend: DisplayItem[] = []
    desend: DisplayItem[] = []
    /* Constructor: */
    constructor(data: DisplayItem[], sortKey: KEY) {
        this.key = sortKey
        if (data.length > 0) {
            this.desend = [...this.sortByDescend(data, sortKey)]
            this.ascend = [...this.desend].reverse()
        }
    }

    /**
     * Return  array sorted from low to high
     * @returns { DisplayItem[] } - sorted array
     */
    public getAscend(): DisplayItem[] {
        return this.ascend
    }

    /**
     * Return  array sorted from high to low
     * @returns { DisplayItem[] } - sorted array
     */
    public getDesend(): DisplayItem[] {
        return this.desend
    }

    /**
     * Return  array sorted from  high to low
     * When sorting by balance or USD, since values are BN, it needs to be converted to Number
     * @returns { DisplayItem[] } - sorted array
     */
    private sortByDescend(data: DisplayItem[], key: KEY): DisplayItem[] {
        if (data?.length && key) {
            if (key === KEY.ETH || key === KEY.ETH_USD || key === KEY.TOTAL) {
                return data.sort((x, y) => {
                    const i = x[key as keyof DisplayItem] as unknown as BN
                    const _y = y[key as keyof DisplayItem] as unknown as BN
                    if (BN.isBigNumber(i) && BN.isBigNumber(_y)) {
                        const a = _y.toNumber()
                        const b = i.toNumber()
                        return a < b ? -1 : a > b ? 1 : 0
                    }

                    return 0
                })
            }

            return data.sort((x, y) => {
                const a = y[key as keyof DisplayItem]?.toString().toLowerCase()
                const b = x[key as keyof DisplayItem]?.toString().toLowerCase()
                if (a && b) {
                    return a < b ? -1 : a > b ? 1 : 0
                }
                return 0
            })
        }
        return []
    }
}
// /**
//  * Sets address input with timeout from child
//  * @param _value user input
//  */
// const setName = (_value: string) => {
//     state.nameInput = _value
// }

// /**
//  * Checks if name input was valid
//  * Returns true if input is not emty and string is invalid
//  * @param _value user input
//  */
// const hasNameError = computed<boolean>(() => {
//     return state.nameInput !== '' && !isValidName.value
// })

// /**
//  * Checks if name is new
//  * @param _value user input
//  */
// const isValidName = computed<boolean>(() => {
//     console.log('isValid Name', !store.addressNameIsSaved(state.nameInput))
//     return !store.addressNameIsSaved(state.nameInput)
// })
</script>

<style scoped lang="scss">
.empty-identicon {
    height: 24px;
    width: 24px;
    background-color: rgb(var(--v-theme-loading));
    border-radius: 50%;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
