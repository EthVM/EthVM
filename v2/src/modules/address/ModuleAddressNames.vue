<template>
    <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
        <v-row align="start" justify="start">
            <v-col cols="6">
                <p class="font-weight-bold text-h5">Address Names</p>
                <p class="">Add custom names to addresses in order to easily track them through ethVM</p>
            </v-col>
            <v-col cols="6" class="d-flex align-center justify-end">
                <app-btn text="import" class="ml-5"></app-btn>
                <app-btn text="export"></app-btn>
            </v-col>
            <!--
                FILTER
            -->
            <v-col cols="12" class="d-flex align-center justify-space-between">
                <div class="flex-grow-1 my-5">
                    <app-input place-holder="Search by hash or name" v-model="state.searchParams" />
                </div>
            </v-col>
            <!--
                HEADER/SORT
            -->
            <v-row :dense="xs" class="d-flex text-body-1 text-info mb-0" :justify="xs ? 'end' : 'start'">
                <v-col cols sm="6" lg="6" class="py-0 d-none d-sm-block">
                    <v-btn variant="text" color="info" class="font-weight-regular ml-n1" rounded="pill" size="small" @click="sortTable(SORT_KEY.HASH)">
                        Address
                        <v-icon v-if="isActiveSort(SORT_KEY.HASH)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                </v-col>
                <v-col sm="6" lg="6" class="py-0 d-none d-sm-block">
                    <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.NAME)">
                        Name
                        <v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                </v-col>
                <v-spacer class="d-flex d-sm-none" />
                <!--
               Mobile Sort:
                XS: on the right end
                SM and UP: none
             -->
                <v-col class="d-flex d-sm-none justify-end">
                    <v-btn variant="text" color="info" class="font-weight-regular mr-n1" rounded="pill" size="small" id="activator-mobile-sort">
                        {{ activeSortString }}
                        <v-icon class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                    <app-menu min-width="140" activator="#activator-mobile-sort" :close-on-content-click="false">
                        <v-list-item title="Name" class="py-2" @click="sortTable(SORT_KEY.NAME)">
                            <template #append>
                                <v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item title="Address" class="py-2" @click="sortTable(SORT_KEY.HASH)">
                            <template #append>
                                <v-icon v-if="isActiveSort(SORT_KEY.HASH)" class="ml-1" :size="14">{{ sortIcon }}</v-icon>
                            </template>
                        </v-list-item>
                    </app-menu>
                </v-col>
            </v-row>
            <v-divider class="mx-n4 mx-sm-n6 mt-sm-3" />
            <v-col cols="12" class="pa-0">
                <template v-if="sortedList.length > 0">
                    <div class="p-ten-top">
                        <table-row-adr-name v-for="adr in currentPageData" :key="adr.hash" :adr="adr"></table-row-adr-name>
                    </div>
                </template>
                <template v-else>
                    <app-no-result :text="`You did not namy any  addresses yet`" class="mt-3"></app-no-result>
                </template>
                <template v-if="showPagination">
                    <app-pagination :length="numberOfPages" @update:modelValue="setPage" :current-page="pageNum" />
                </template>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import AppBtn from '@/core/components/AppBtn.vue'
import AppInput from '@/core/components/AppInput.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import AppMenu from '@/core/components/AppMenu.vue'
import AppPagination from '@core/components/AppPagination.vue'
import TableRowAdrName from './components/TableRowAdrName.vue'
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { PortfolioItem } from '@/store/helpers'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'

const { xs } = useDisplay()
const store = useStore()

enum SORT_KEY {
    NAME = 'name',
    HASH = 'hash'
}
const SORT_DIR = {
    HIGH: 'high',
    LOW: 'low'
}

/**------------------------
 * Sort
 -------------------------*/

interface SortedInterface {
    key: SORT_KEY
    ascend: PortfolioItem[]
    desend: PortfolioItem[]
}
class Sorted implements SortedInterface {
    /* Properties: */
    key: SORT_KEY
    ascend: PortfolioItem[] = []
    desend: PortfolioItem[] = []
    /* Constructor: */
    constructor(data: PortfolioItem[], sortKey: SORT_KEY) {
        this.key = sortKey
        if (data.length > 0) {
            this.desend = [...this.sortByDescend(data, sortKey)]
            this.ascend = [...this.desend].reverse()
        }
    }

    /**
     * Return  array sorted from low to high
     * @returns { PortfolioItem[] } - sorted array
     */
    public getAscend(): PortfolioItem[] {
        return this.ascend
    }

    /**
     * Return  array sorted from high to low
     * @returns { PortfolioItem[] } - sorted array
     */
    public getDesend(): PortfolioItem[] {
        return this.desend
    }

    /**
     * Return  array sorted from  high to low
     * When sorting by balance or USD, since values are BN, it needs to be converted to Number
     * @returns { PortfolioItem[] } - sorted array
     */
    private sortByDescend(data: PortfolioItem[], key: SORT_KEY): PortfolioItem[] {
        if (data?.length && key) {
            return data.sort((x, y) => {
                const a = y[key as keyof PortfolioItem]?.toString().toLowerCase()
                const b = x[key as keyof PortfolioItem]?.toString().toLowerCase()
                if (a && b) {
                    return a < b ? -1 : a > b ? 1 : 0
                }
                return 0
            })
        }
        return []
    }
}

interface ComponentState {
    sortKey: SORT_KEY
    sortDirection: string
    searchParams: string
}

const state: ComponentState = reactive({
    sortKey: SORT_KEY.NAME,
    sortDirection: SORT_DIR.LOW,
    searchParams: ''
})

const sortIcon = computed<string>(() => {
    return state.sortDirection.includes(SORT_DIR.HIGH) ? 'south' : 'north'
})

const isActiveSort = (key: SORT_KEY): boolean => {
    return state.sortKey.includes(key)
}

const addressList = computed<PortfolioItem[]>(() => {
    return [...store.portfolio, ...store.adrBook]
})

const sortedList = computed<PortfolioItem[]>(() => {
    const sorted = new Sorted(addressList.value, state.sortKey)
    return state.sortDirection.includes(SORT_DIR.HIGH) ? sorted.getDesend() : sorted.getAscend()
})

const sortTable = (key: SORT_KEY): void => {
    if (state.sortKey === key) {
        state.sortDirection = state.sortDirection === SORT_DIR.HIGH ? SORT_DIR.LOW : SORT_DIR.HIGH
    }
    state.sortKey = key
}

const activeSortString = computed<string>(() => {
    if (state.sortKey.includes(SORT_KEY.NAME)) {
        return 'Name'
    }
    return 'Address'
})

/**------------------------
 * Pagination
 -------------------------*/

const MAX_ITEMS = 20

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(sortedList, 'settingsAddressNames', MAX_ITEMS)

const showPagination = computed<boolean>(() => {
    return !!sortedList.value && sortedList.value.length > MAX_ITEMS
})
const setPage = (pageNum: number): void => {
    setPageNum(pageNum)
}
</script>

<style lang="scss" scoped></style>
