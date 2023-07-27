<template>
    <v-card variant="elevated" elevation="1" rounded="xl" class="py-4 py-sm-6 h-100" min-height="264">
        <!--
        ===================================================
            Title 
        ===================================================
        -->
        <v-row class="px-4 px-sm-6 mb-1 mb-md-6 align-center justify-space-between">
            <v-col cols="12" md="auto" lg="4" order="last" order-md="first">
                <h4 class="text-h4 font-weight-bold">{{ $t('token.bigMovers') }}</h4>
            </v-col>
            <v-spacer />
            <v-col cols="12" md="auto" lg="8" order="first" order-md="last" class="mb-2 mb-md-0">
                <app-ad-buttons-small />
            </v-col>
        </v-row>
        <!--
        ===================================================
           Loading Containers
        ===================================================
        -->
        <v-row v-if="loading" class="px-4 px-sm-6 mt-0">
            <v-col cols="6" sm="3" lg="2" v-for="item in loadingContainersCount" :key="item">
                <div class="skeleton-box rounded-xl" style="height: 144px"></div>
            </v-col>
        </v-row>
        <!--
        ===================================================
          No Fetch Result
        ===================================================
        -->
        <app-no-result v-if="!loading && !bigMovers" :text="$t('message.noBigMovers')" class="mt-4 mt-sm-6"></app-no-result>
        <!--
        ===================================================
          Movers Row
        ===================================================
        -->
        <div v-if="!loading && bigMovers">
            <v-sheet>
                <!-- PREVIOS AND NEXT BUTTONS -->
                <v-btn v-if="!xs" icon="chevron_left" height="34px" width="34px" @click="scrollToPrev" class="slide_b prev" variant="flat" />
                <v-btn v-if="!xs" icon="chevron_right" height="34px" width="34px" @click="scrollToNext" class="slide_b next" variant="flat" />
                <div class="slide d-flex overflow-x-auto pr-5" ref="scrollContainer">
                    <div v-for="(i, index) in bigMovers" :key="i.contractAddress + '-' + i.name + index" class="pl-5" :id="index + 'mover'">
                        <v-sheet min-width="146" max-width="230" rounded="xl" :border="true" class="px-4 py-3 container-shadow">
                            <!-- TOKEN ICON, NAME, SYMBOL -->
                            <div class="d-flex flex-nowrap">
                                <app-token-icon :token-icon="getTokenIcon(i)"></app-token-icon>
                                <div class="ml-2">
                                    <p class="d-block text-truncate" style="max-width: 156px">{{ i.name }}</p>
                                    <p class="text-info text-uppercase">{{ i.symbol }}</p>
                                </div>
                            </div>
                            <!-- PRICE, PERCENTAGE CHANGE -->
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
                        <!-- TIME AGO -->
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
import AppAdButtonsSmall from '@/core/components/AppAdButtonsSmall.vue'
import { useGetBigMoversQuery, useBigMoversUpdateSubscription } from './apollo/big-movers/bigMovers.generated'
import { TokenMarketMoverType, BigMoverFragment } from '@/apollo/types'
import { formatUsdValue, FormattedNumber, formatPercentageValue } from '@/core/helper/number-format-helper'
import { computed, ref } from 'vue'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useNetwork } from '@/core/composables/Network/useNetwork'
import BigNumber from 'bignumber.js'
import { timeAgo } from '@/core/helper'
import { useScroll } from '@vueuse/core'

const { t } = useI18n()
const { xs, sm, md, lgAndUp } = useDisplay()
const { supportsFiat, coingeckoId } = useNetwork()
const { loading: loadingCoinData, getEthereumTokenByContract, ethMarketInfo } = useCoinData()

/**------------------------
 * Fetch Movers:
 -------------------------*/
const {
    loading: loadingBigMovers,
    result,
    refetch
} = useGetBigMoversQuery(() => ({
    enabled: supportsFiat.value
}))

const bigMovers = computed<BigMoverFragment[]>(() => {
    const res = result?.value?.getTokenMarketMovers.items.filter((x): x is BigMoverFragment => x !== undefined) || []
    return res.slice(0, 100)
})

const { onResult: onSubscriptionResult } = useBigMoversUpdateSubscription(() => ({
    enabled: supportsFiat.value
}))

onSubscriptionResult(() => {
    refetch()
})

/**------------------------
 * Loading State:
 -------------------------*/
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

/**------------------------
 * Movers Data Format:
 -------------------------*/
const getTokenIcon = (token: BigMoverFragment): string | undefined => {
    const contract = token.contractAddress
    const backUpIcon = token.iconPng || undefined
    if (token.coingeckoCoinId === coingeckoId.value && ethMarketInfo.value) {
        return ethMarketInfo.value?.image
    }
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
const scrollContainer = ref<HTMLElement | null>(null)
const { x, isScrolling } = useScroll(scrollContainer)

const scrollToNext = () => {
    if (scrollContainer.value && scrollContainer.value && !isScrolling.value) {
        const containerWidth = scrollContainer.value.offsetWidth
        const containerLeftOffset = scrollContainer.value.getBoundingClientRect().left
        let index = 0
        let next: null | number = null
        while (index < bigMovers.value.length && next === null) {
            const el = document.getElementById(index + 'mover')
            if (el) {
                const endContainer = containerWidth + containerLeftOffset
                const elEndRight = el.getBoundingClientRect().right - containerLeftOffset
                if (elEndRight > endContainer) {
                    next = el.getBoundingClientRect().left - containerLeftOffset + x.value
                }
            }
            index = index + 1
        }
        scrollContainer.value.scroll({ left: next || containerLeftOffset, top: 0, behavior: 'smooth' })
    }
}

const scrollToPrev = () => {
    if (scrollContainer.value && scrollContainer.value && !isScrolling.value) {
        const containerWidth = scrollContainer.value.offsetWidth
        const containerLeftOffset = scrollContainer.value.getBoundingClientRect().left
        let index = bigMovers.value.length - 1
        let prev: null | number = null
        while (index > -1 && prev === null) {
            const el = document.getElementById(index + 'mover')
            if (el) {
                const elStartLeft = el.getBoundingClientRect().left - containerLeftOffset + x.value
                if (x.value === 0 && index === bigMovers.value.length - 1) {
                    prev = elStartLeft
                } else {
                    const elEndRight = x.value + el.getBoundingClientRect().right - containerWidth - containerLeftOffset
                    const isFirstVisible = elStartLeft >= 0 && el.getBoundingClientRect().left <= 0
                    if (isFirstVisible) {
                        prev = elEndRight
                    }
                }
            }
            index = index - 1
        }

        scrollContainer.value.scroll({ left: prev || 0, top: 0, behavior: 'smooth' })
    }
}
</script>

<style scoped lang="scss">
.container-shadow {
    filter: drop-shadow(0px 5px 5px rgb(24, 43, 75, 0.1));
}
.slide {
    position: relative;
}

.slide_b {
    position: absolute !important;
    top: 54% !important;
    z-index: 2;
    border: 1px solid rgb(var(--v-border-color), 0.12);
    filter: drop-shadow(0px 5px 5px rgb(24, 43, 75, 0.1));
    @media (min-width: 905px) {
        top: 46% !important;
    }
}
.next {
    right: 8px !important;
}
.prev {
    left: 8px !important;
}
.loading-div {
    padding-left: 10px;
    padding-right: 10px;
}
</style>
