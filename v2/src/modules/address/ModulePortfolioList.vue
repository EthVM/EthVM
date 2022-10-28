<template>
    <div class="pa-4 pa-sm-6">
        <module-add-adress-to-porfolio address="0xC5cA2Dd997E7Aa97f2DE490e329578Be27e9E644" />

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

        <v-divider class="mx-n4 mx-sm-n6 mb-1 mb-sm-5" />
        <template v-if="!loadingCoinData">
            <template v-if="addressList.length > 0">
                <div v-for="adr in addressList" :key="adr.hash">
                    <v-row :dense="xs" :class="'mt-sm-4 d-flex text-body-1 text-info mb-sm-3'" :justify="xs ? 'end' : 'start'">
                        <v-col xs="6" sm="5" md="4" class="py-0 d-flex align-center">
                            <module-add-adress-to-porfolio :address="adr.hash" />
                            <app-address-blockie :address="adr.hash" class="ml-5 mr-4" />
                            <div><app-transform-hash :hash="eth.toCheckSum(adr.hash)" :link="adr.hash" is-blue is-short /> {{ adr.name }}</div>
                        </v-col>
                        <v-col sm="7" md="8" class="d-none d-sm-flex">
                            <v-row>
                                <!--
                        NAME:
                        hidden on xs-md
                    -->
                                <v-col lg="3" class="py-0 d-none d-lg-block">
                                    {{ adr.name }}
                                </v-col>
                                <!--
                        ETH Balance:
                        hidden on xs
                    -->
                                <v-col sm="6" md="4" lg="3" class="py-0 d-none d-sm-block"> </v-col>
                                <!--
                        ETH Value:
                        hidden on xs-sm
                    -->
                                <v-col md="4" lg="3" class="py-0 d-none d-md-block"> </v-col>
                                <!--
                        total:
                        hidden on xs
                    -->
                                <v-col sm="6" md="4" lg="3" class="py-0 d-none d-sm-block"> </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </div>
            </template>

            <template v-else>
                <app-no-result :text="`Your portfolio is empty`"></app-no-result>
            </template>
        </template>
        <div v-else class="skeleton-box rounded-xl mt-1 my-4" style="height: 90%"></div>
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

const { xs } = useDisplay()
const store = useStore()

enum KEY {
    NAME = 'NAME',
    HASH = 'HASH',
    ETH = 'ETH',
    ETH_USD = 'ETH',
    TOTAL = 'TOTAL'
}
const DIRECTION = {
    HIGH: 'HIGH',
    LOW: 'LOW'
}

interface ComponentState {
    sortKey: string
}

const state: ComponentState = reactive({
    sortKey: `{${KEY.TOTAL}_${DIRECTION.HIGH}`
})

const sortIcon = computed<string>(() => {
    return state.sortKey.includes(DIRECTION.HIGH) ? 'south' : 'north'
})

const isActiveSort = (key: KEY): boolean => {
    return state.sortKey.includes(key)
}

/** -------------------
 * Address Input Handler
 ---------------------*/
const { loading: loadingCoinData } = useCoinData()
/**
 * Checks if name is new
 * @param _value user input
 */
const addressList = computed(() => {
    console.log(store.portfolio.length)
    return store.portfolio
})

/** -------------------
 * Address Input Handler
 ---------------------*/

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

// /** -------------------
//  * Add New Address
//  ---------------------*/
// const isValidInput = computed<boolean>(() => {
//     return state.nameInput !== '' && state.adrInput !== '' && !hasAddressError.value && !hasNameError.value
// })

// const addAddressToPortfolio = (): void => {
//     store.addAddress(state.adrInput, state.nameInput)
//     state.openDialog = false
//     state.adrInput = ''
//     state.nameInput = ''
// }
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
