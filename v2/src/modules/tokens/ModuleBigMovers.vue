<template>
    <v-card variant="elevated" elevation="1" rounded="xl" class="py-4 py-sm-6 h-100" min-height="232px">
        <v-card-title class="py-0 px-4 px-sm-6 mb-2 mb-sm-4 d-flex align-center justify-space-between">
            <h4 class="font-weight-bold text-h4">
                {{ $t('token.bigMovers') }}
            </h4>
        </v-card-title>
        <v-row v-if="loading" class="px-4 px-sm-6">
            <v-col cols="6" sm="3" lg="2" v-for="item in loadingContainersCount" :key="item">
                <div class="skeleton-box rounded-xl my-5" style="height: 144px"></div>
            </v-col>
        </v-row>
        <app-no-result v-if="!loading && !bigMovers" :text="$t('message.noBigMovers')" class="mt-4 mt-sm-6"></app-no-result>

        <div v-if="!loading && bigMovers">
            {{ x }} {{ y }}
            <v-sheet>
                <v-btn v-if="!xs" icon="chevron_left" height="34px" width="34px" @click="slideToNext" class="slide_prev" variant="flat" />
                <v-btn v-if="!xs" icon="chevron_right" height="34px" width="34px" @click="slideToNext" class="slide_next" variant="flat" />
                <div class="slide d-flex overflow-x-auto pr-5" ref="scrollContainer">
                    <div
                        v-for="(i, index) in bigMovers"
                        :key="i.contractAddress + '-' + i.name + index"
                        class="pl-5"
                        :ref="el => assignRef(el, index)"
                        :id="index + 'mover'"
                    >
                        <v-sheet min-width="146" max-width="230" rounded="xl" :border="true" class="px-4 py-3 container-shadow">
                            <div class="d-flex flex-nowrap">
                                <app-token-icon :token-icon="getTokenIcon(i)"></app-token-icon>
                                <div class="ml-2">
                                    <p class="d-block text-truncate" style="max-width: 156px">{{ i.name }}</p>
                                    <p class="text-info text-uppercase">{{ i.symbol }}</p>
                                </div>
                            </div>
                            <div class="d-flex flex-nowrap justify-end flex-column">
                                <div>
                                    <h5 class="text-right text-h5 font-weight-bold d-block text-truncate" style="max-width: 196px">
                                        {{ formatPrice(i.price || 0).value }}
                                    </h5>
                                </div>
                                <div>
                                    <p class="text-right text-info font-weight-bold text-caption d-block text-truncate" style="max-width: 196px">
                                        {{ formatTime(i.type) }}
                                        <span :class="[getChangeClass(i.priceChangePercentage || 0), 'text-h5 font-weight-bold pl-2']">
                                            %{{ formatPercentageValue(new BigNumber(i.priceChangePercentage || 0)).value }}</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </v-sheet>
                        <p class="text-info text-caption mt-2 pl-4">{{ timeAgo(new Date(i.eventTimestampUnixSec * 1e3)) }}</p>
                    </div>
                </div>
            </v-sheet>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import { useGetBigMoversQuery } from './apollo/big-movers/bigMovers.generated'
import { TokenMarketMoverType, BigMoverFragment } from '@/apollo/types'
import { formatUsdValue, FormattedNumber, formatPercentageValue } from '@/core/helper/number-format-helper'
import { computed, ref, reactive } from 'vue'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useNetwork } from '@/core/composables/Network/useNetwork'
import BigNumber from 'bignumber.js'
import { timeAgo } from '@/core/helper'
import { useScroll } from '@vueuse/core'

const { t } = useI18n()

const { xs, sm, md, lgAndUp } = useDisplay()
const { supportsFiat } = useNetwork()
const { loading: loadingCoinData, getEthereumTokenByContract } = useCoinData()

/*
===================================================================================
Fetch Movers:
===================================================================================
*/
const { loading: loadingBigMovers, result } = useGetBigMoversQuery()

const bigMovers = computed<BigMoverFragment[]>(() => {
    const res = result?.value?.getTokenMarketMovers.items.filter((x): x is BigMoverFragment => x !== undefined) || []
    return res.slice(0, 100)
})

const loading = computed<boolean>(() => {
    return loadingBigMovers.value || loadingCoinData.value
})

const loadingContainersCount = computed<number>(() => {
    if (lgAndUp.value) {
        return 6
    }
    if (md.value || sm.value) {
        return 4
    }
    return 2
})

const getTokenIcon = (token: BigMoverFragment): string | undefined => {
    const contract = token.contractAddress
    const backUpIcon = token.iconPng || undefined
    if (contract) {
        const tokenData = getEthereumTokenByContract(contract)
        if (tokenData) {
            return tokenData.image
        }
    }
    return backUpIcon
}

const formatPrice = (usd: number): FormattedNumber => {
    return formatUsdValue(new BigNumber(usd))
}

const formatTime = (type: TokenMarketMoverType): string => {
    switch (type) {
        case TokenMarketMoverType['1H']:
            return t('bigMover.1H')
        case TokenMarketMoverType['24H']:
            return t('bigMover.24H')
        case TokenMarketMoverType.Ath:
            return t('bigMover.ath')
        case TokenMarketMoverType['30D']:
            return t('bigMover.30D')
        case TokenMarketMoverType['5M']:
            return t('bigMover.5M')
        default:
            return t('bigMover.7D')
    }
}

const getChangeClass = (percentage: number): string => {
    return new BigNumber(percentage).gt(0) ? 'text-success' : new BigNumber(percentage).lt(0) ? 'text-error' : 'textPrimary-text'
}
/**------------------------
 * Scroll
 -------------------------*/
// interface RowRef {
//    e: HTMLInputElement | null
// }
// interface ScrollState {
//     rowRefs: <RowRef>[]
// }
// const state = reactive<ScrollState>({
//     rowRefs: []
// })

// interface Refs {
//     el: HTMLInputElement
// }

const rowRefs = ref<HTMLInputElement[]>([])
const scrollContainer = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState, directions } = useScroll(scrollContainer)

const slideToNext = () => {
    console.log('Hello', scrollContainer.value?.offsetWidth)
    // console.log('f')
    const containerWidth = scrollContainer.value?.offsetWidth
    const el = document.getElementById(0 + 'mover')
    const els = document.getElementById(3 + 'mover')
    console.log(el.getBoundingClientRect().width)
    console.log(els.getBoundingClientRect().width)
    // First Visible:
    // if (contatinerWidth) {
    //     if (x.value === 0) {

    //     }
    //     console.log(x.value)

    // }
    if (scrollContainer.value && containerWidth) {
        const next = x.value + (containerWidth - 20)
        scrollContainer.value.scroll({ left: next, top: 0, behavior: 'smooth' })
    }
}

const assignRef = (el: HTMLInputElement, index: number) => {
    // // const refs = [...Array(bigMovers.value.length)]
    // console.log(el.getBoundingClientRect().width)
    rowRefs.value.push(el)
}
</script>

<style scoped lang="scss">
.container-shadow {
    filter: drop-shadow(0px 5px 5px rgb(24, 43, 75, 0.1));
}
.slide {
    position: relative;
}
.slide_next {
    position: absolute !important;
    top: 46%;
    right: 1%;
    z-index: 2;
    border: 1px solid rgb(var(--v-border-color), 0.12);
    filter: drop-shadow(0px 5px 5px rgb(24, 43, 75, 0.1));
}

.slide_prev {
    position: absolute !important;
    top: 46%;
    left: 1%;
    z-index: 2;
    border: 1px solid rgb(var(--v-border-color), 0.12);
    filter: drop-shadow(0px 5px 5px rgb(24, 43, 75, 0.1));
}
</style>
