<template>
    <div :class="['px-4 px-sm-6 pb-4 pb-sm-6', { 'mt-n4 mt-sm-0': !props.isHomePage }]">
        <!--Table Header-->
        <v-row :dense="xs" :class="'d-flex text-body-1 text-info mb-0'" :justify="xs ? 'end' : 'start'">
            <v-col sm="6" lg="3" class="py-0 d-none d-sm-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.HASH)">
                    {{ $t('common.address') }}
                    <v-icon v-if="isActiveSort(KEY.HASH)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
            <!--
                        NAME:
                        hidden on xs-md
                    -->
            <v-col lg="3" class="py-0 d-none d-lg-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.NAME)">
                    {{ $t('common.name') }}
                    <v-icon v-if="isActiveSort(KEY.NAME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
            <!--
                        ETH Balance:
                        hidden on xs
                    -->
            <v-col sm="3" lg="2" class="py-0 d-none d-sm-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.ETH)">
                    {{ currencyName }} {{ $t('common.balance') }} <v-icon v-if="isActiveSort(KEY.ETH)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
            <!--
                        ETH Value:
                        hidden on xs-sm
                    -->
            <v-col lg="2" class="py-0 d-none d-lg-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.ETH_USD)">
                    {{ currencyName }} {{ $t('common.value') }} <v-icon v-if="isActiveSort(KEY.ETH_USD)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
            <!--
                        total:
                        hidden on xs
                    -->
            <v-col sm="3" lg="2" class="py-0 d-none d-sm-block">
                <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(KEY.TOTAL)">
                    {{ $t('common.total') }}
                    <v-icon v-if="isActiveSort(KEY.TOTAL)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                >
            </v-col>
            <v-spacer v-if="!props.isHomePage" class="d-flex d-sm-none" />
            <!--
               Mobile Sort:
                XS: on the right end
                SM: none
             -->
            <v-col v-if="!props.isHomePage" class="d-flex d-sm-none justify-end">
                <v-btn variant="text" color="info" class="font-weight-regular mr-n3 d-block" rounded="pill" size="small" id="activator-mobile-sort">
                    {{ activeSortString }}
                    <v-icon class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                >
                <app-menu min-width="140" activator="#activator-mobile-sort" :close-on-content-click="false">
                    <v-list-item :title="$t('common.name')" class="py-2" @click="sortTable(KEY.NAME)">
                        <template #append>
                            <v-icon v-if="isActiveSort(KEY.NAME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item :title="$t('common.address')" class="py-2" @click="sortTable(KEY.HASH)">
                        <template #append>
                            <v-icon v-if="isActiveSort(KEY.HASH)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item :title="$t('common.balance')" class="py-2" @click="sortTable(KEY.ETH)">
                        <template #append>
                            <v-icon v-if="isActiveSort(KEY.ETH)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></template
                        >
                    </v-list-item>
                    <v-list-item :title="$t('common.value')" class="py-2" @click="sortTable(KEY.ETH_USD)">
                        <template #append>
                            <v-icon v-if="isActiveSort(KEY.ETH_USD)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item :title="$t('common.total')" class="py-2" @click="sortTable(KEY.TOTAL)">
                        <template #append>
                            <v-icon v-if="isActiveSort(KEY.TOTAL)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></template
                        >
                    </v-list-item>
                </app-menu>
            </v-col>
        </v-row>

        <v-divider class="mx-n4 mx-sm-n6 mt-sm-3" />
        <template v-if="addressList.length > 0">
            <div class="p-ten-top">
                <div v-for="adr in sortList" flat :key="adr.hash">
                    <table-row-portfolio-item :adr="adr"></table-row-portfolio-item>
                </div>
            </div>
        </template>
        <template v-else>
            <app-no-result :text="$t('block.portfolioEmpty')" class="mt-3"></app-no-result>
        </template>
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import AppMenu from '@core/components/AppMenu.vue'
import TableRowPortfolioItem from './components/TableRowPortfolioItem.vue'
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatUsdValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useNetwork } from '@core/composables/Network/useNetwork'

const { xs } = useDisplay()
const { currencyName } = useNetwork()
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

const props = defineProps({
    isHomePage: {
        type: Boolean,
        default: false
    }
})

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
    // totalBN?: BN
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
            weiBN: isLoaded ? new BN(store.portfolioEthBalanceMap[cleanHash].weiBalance) : undefined,
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
const activeSortString = computed<string>(() => {
    if (state.sortKey.includes(KEY.HASH)) {
        return 'Address'
    } else if (state.sortKey.includes(KEY.ETH)) {
        return 'ETH Balance'
    } else if (state.sortKey.includes(KEY.NAME)) {
        return 'Name'
    } else if (state.sortKey.includes(KEY.ETH_USD)) {
        return 'ETH Value'
    } else if (state.sortKey.includes(KEY.TOTAL)) {
        return 'Total'
    }
    return 'Sort'
})

interface SortedInterface {
    key: KEY
    ascend: DisplayItem[]
    desend: DisplayItem[]
}

class Sorted implements SortedInterface {
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
