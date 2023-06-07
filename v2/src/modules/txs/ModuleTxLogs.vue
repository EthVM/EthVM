<template>
    <div>
        <div v-if="isReady && !props.loading">
            <div class="mb-5">
                <div v-if="props.logs.length > 0" class="px-3 px-sm-5">
                    <app-btn text="filter" @click="setFilter(true)" is-small class="ma-1"></app-btn>
                    <app-btn v-if="activeFilters.length > 0" text="Clear All" @click="clearFilter()" is-small class="ma-1" icon="close"></app-btn>
                </div>
                <div class="px-3 px-sm-5">
                    <v-btn
                        v-for="filter in activeFilters"
                        :text="filter.text"
                        @click="removeFilter(filter)"
                        color="greyCard"
                        variant="flat"
                        height="24px"
                        :key="filter.value"
                        class="ma-1 rounded-pill text-greyTextFilter text-body-1 px-3"
                    >
                        <template #append>
                            <v-icon icon="close" size="14"></v-icon>
                        </template>
                        <template #default v-if="filter.type === 'ADR'">
                            <app-address-blockie :address="filter.value" :size="4" class="mr-2" />
                            <app-transform-hash :is-short="!store.getAddressName(filter.value)" :hash="eth.toCheckSum(filter.value)" />
                        </template>
                    </v-btn>
                </div>
            </div>

            <div v-if="props.logs.length > 0">
                <div v-for="(log, index) in currentPageData" :key="log.logIndex">
                    <tx-log-row :log="log" :index="index + LIMIT * (pageNum - 1) + 1"></tx-log-row>
                </div>
            </div>
            <div v-else class="mb-13 mb-sm-10">
                <app-no-result text="There are no logs found in this transaction" class="mx-4 mx-sm-6"></app-no-result>
            </div>
        </div>
        <template v-else>
            <div v-for="item in 3" :key="item" class="px-4 px-sm-6 mb-4 mb-sm-6">
                <div class="skeleton-box rounded-xl" style="height: 300px"></div>
            </div>
        </template>
        <app-pagination v-if="showPagination" :length="numberOfPages" @update:modelValue="loadMoreData" :current-page="pageNum" />
        <app-dialog v-model="openFilterDialog" height="650" width="400" @update:model-value="setFilter">
            <template #no-scroll-content>
                <v-row class="align-center justify-space-between px-6">
                    <p class="text-h5 font-weight-bold text-capitalize">Filter</p>
                    <app-btn-icon icon="close" @click="setFilter(false)" />
                </v-row>
            </template>
            <template #scroll-content>
                <div>
                    <v-divider class="mb-4 mt-0" />
                    <p class="font-weight-medium mb-2">Events</p>
                    <app-input place-holder="Search events" v-model="searchEvents" />
                    <div class="d-flex pt-1">
                        <v-virtual-scroll v-if="eventSignatures.length > 0" :height="180" :items="eventSignatures" item-height="60">
                            <template #default="{ item }">
                                <v-list-item class="px-0 align-start py-1">
                                    <template #title>
                                        <p class="mb-1 mt-3">{{ item.name ? item.name : '' }}</p>
                                    </template>
                                    <template #subtitle>
                                        <p class="text-ellipses mt-1" style="max-width: 110px">{{ item.signature }}</p></template
                                    >
                                    <template #prepend>
                                        <v-checkbox-btn v-model="item.selected" class="mr-2" @click="selectItem(item)"></v-checkbox-btn>
                                    </template> </v-list-item
                            ></template>
                        </v-virtual-scroll>
                        <app-no-result v-else text="No events found" class="mt-3 w-100" height="168"></app-no-result>
                    </div>
                    <v-divider class="my-4" />
                    <p class="font-weight-medium mb-2">Addresses</p>
                    <app-input place-holder="Search Addresses" v-model="searchAdr" />
                    <div class="d-flex pt-1">
                        <v-virtual-scroll v-if="addressList.length > 0" :height="180" :items="addressList" item-height="58">
                            <template #default="{ item }">
                                <v-list-item class="pa-0 align-start">
                                    <template #title>
                                        <v-row class="flex-nowrap align-center justify-start p-ten-top p-ten-b" no-gutters>
                                            <app-address-blockie :address="item.hash" :size="7" class="mr-2" />
                                            <v-col cols="9">
                                                <p v-if="item.name" class="text-ellipses">
                                                    {{ item.name }}
                                                </p>
                                                <app-transform-hash
                                                    is-short
                                                    is-blue
                                                    :hash="eth.toCheckSum(item.hash)"
                                                    :link="`/address/${item.hash}`"
                                                    :show-name="false"
                                                />
                                            </v-col>
                                        </v-row>
                                    </template>
                                    <template #prepend>
                                        <v-checkbox-btn v-model="item.selected" class="mr-2" @click="selectItem(item)"></v-checkbox-btn>
                                    </template> </v-list-item
                            ></template>
                        </v-virtual-scroll>
                        <app-no-result v-else text="No addresses found" class="mt-3 w-100" height="168"></app-no-result>
                    </div>
                </div>
            </template>
        </app-dialog>
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import AppDialog from '@/core/components/AppDialog.vue'
import AppBtn from '@/core/components/AppBtn.vue'
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppInput from '@/core/components/AppInput.vue'
import AppBtnIcon from '@/core/components/AppBtnIcon.vue'
import TxLogRow from './components/TxLogRow.vue'
import { PropType, computed, ref, watch, onMounted } from 'vue'
import { LogFragmentFragment as Log } from '@module/txs/apollo/TxDetails/TxDetails.generated'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import AppPagination from '@core/components/AppPagination.vue'
import { eth } from '@core/helper/eth'
import { useStore } from '@/store'
import { searchHelper } from '@core/helper/search'
import { watchDebounced } from '@vueuse/core'
const store = useStore()

const props = defineProps({
    txRef: {
        type: String,
        required: true
    },
    logs: {
        type: Array as PropType<Array<Log>>,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: true
    }
})

/** -------------------
 * Filter
 * --------------------*/

const openFilterDialog = ref(false)
const setFilter = (_value: boolean) => {
    openFilterDialog.value = _value
}

interface EventSig {
    name?: string
    signature: string
    selected: boolean
    type: 'EVENT'
}
interface Adr {
    hash: string
    name?: string
    selected: boolean
    type: 'ADR'
}

const eventSigRaw = ref<EventSig[]>([])
const addressListRaw = ref<Adr[]>([])
const isReady = ref(false)

const setFilters = (): void => {
    props.logs.forEach(i => {
        const sigFound = eventSigRaw.value.some(e => e.signature === i.topics[0])
        if (!sigFound) {
            eventSigRaw.value.push({
                name: i.signature || undefined,
                signature: i.topics[0],
                selected: false,
                type: 'EVENT'
            })
        }
        const addrFound = addressListRaw.value.some(e => e.hash === i.address.toLowerCase())
        if (!addrFound) {
            addressListRaw.value.push({
                hash: i.address.toLowerCase(),
                name: store.getAddressName(i.address),
                selected: false,
                type: 'ADR'
            })
        }
    })
    isReady.value = true
}
//Setting up filters on loading change
watch(
    () => props.loading,
    (newVal, oldVal) => {
        if (newVal !== oldVal && !newVal) {
            setFilters()
        }
    }
)
onMounted(() => {
    if (!props.loading) {
        setFilters()
    }
})

/**
 * Search Filters inside dialog
 * */
const searchEvents = ref('')
const debounceSearchEvents = ref('')

watchDebounced(
    searchEvents,
    newVal => {
        debounceSearchEvents.value = newVal
    },
    { debounce: 500, maxWait: 1500 }
)

const eventSignatures = computed<EventSig[]>(() => {
    if (isReady.value && !props.loading && debounceSearchEvents.value !== '') {
        return searchHelper(eventSigRaw.value, ['name', 'signature'], debounceSearchEvents.value) as EventSig[]
    }
    return eventSigRaw.value
})

const searchAdr = ref('')
const debounceSearchAdr = ref('')

watchDebounced(
    searchAdr,
    newVal => {
        debounceSearchAdr.value = newVal
    },
    { debounce: 500, maxWait: 1500 }
)
const addressList = computed<Adr[]>(() => {
    if (isReady.value && !props.loading && debounceSearchAdr.value !== '') {
        return searchHelper(addressListRaw.value, ['hash', 'name'], debounceSearchAdr.value) as Adr[]
    }
    return addressListRaw.value
})

/**
 * Filters Array in the ui
 * */
interface Filter {
    text: string
    type: 'ADR' | 'EVENT'
    value: string
}
const activeFilters = ref<Filter[]>([])

/**
 * Function in dialog. Selects and unselects items, but pushing them to the active filter array
 * NOTE: that function is called on click. On click is propageted before v-model is updated, therefore item.selected is reversed
 * @param item {Adr | EventSig} - item to be updated
 */
const selectItem = (item: Adr | EventSig) => {
    //event is propagated before item is selected so use opposite of seleted

    if (!item.selected) {
        // Select Item
        if (item.type === 'ADR') {
            activeFilters.value.push({
                value: item.hash,
                type: 'ADR',
                text: item.hash
            })
        } else {
            let _text = ''
            if (item.name) {
                _text = item.name.split('(')[0]
            } else {
                _text = item.signature.slice(0, 10).concat('', '...')
            }
            activeFilters.value.push({
                value: item.signature,
                type: 'EVENT',
                text: _text
            })
        }
    } else {
        // Unselect Item
        const val = item.type === 'ADR' ? item.hash : item.signature
        const index = activeFilters.value.findIndex(i => i.value === val)
        if (index != -1) {
            activeFilters.value.splice(index, 1)
        }
    }
}

/**
 * Function in Filter button. Unselects items, by removing them in the active filter array and
 * NOTE: that function is called on click. On click is propageted before v-model is updated, therefore item.selected is reversed
 * @param item {Adr | EventSig} - item to be updated
 */
const removeFilter = (item: Filter, cleanActive = true) => {
    if (item.type === 'ADR') {
        const adrIndex = addressListRaw.value.findIndex(i => i.hash === item.value)
        if (adrIndex != -1) {
            addressListRaw.value[adrIndex].selected = false
        }
    } else {
        const eventIndex = eventSigRaw.value.findIndex(i => i.name === item.value || i.signature === item.value)
        if (eventIndex != -1) {
            eventSigRaw.value[eventIndex].selected = false
        }
    }
    if (cleanActive) {
        const index = activeFilters.value.findIndex(i => i.value === item.value)
        if (index != -1) {
            activeFilters.value.splice(index, 1)
        }
    }
}
/**
 * Function in Clear All buttons. Unselects items in the  addressListRaw and  eventSigRaw, resets active Filter array
 */
const clearFilter = () => {
    activeFilters.value.forEach(i => {
        removeFilter(i, false)
    })
    activeFilters.value = []
}

//Reset filters on txRef change

watch(
    () => props.txRef,
    (newVal, oldVal) => {
        if (newVal.toLowerCase() !== oldVal.toLowerCase()) {
            clearFilter()
        }
    }
)

/** -------------------
 * RAW logs
 * --------------------*/

const logs = computed<Log[]>(() => {
    if (isReady.value && !props.loading && activeFilters.value.length > 0) {
        return props.logs.filter(item => {
            return activeFilters.value.some(i => {
                const _value = i.type === 'ADR' ? item.address : item.topics[0]
                return i.value === _value
            })
        })
    }
    return props.logs
})

/** -------------------
 * Pagination
 * --------------------*/
const LIMIT = 20
const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(logs, 'logs', LIMIT)

const loadMoreData = (page: number): void => {
    setPageNum(page)
}

const showPagination = computed<boolean>(() => {
    return logs.value.length > LIMIT
})
</script>
