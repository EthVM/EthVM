<template>
    <div>
        <v-row align="start" justify="start" row class="pr-2 pl-2 pt-1 pb-1">
            <!--
      =====================================================================================
        DETAIL TITLE
      =====================================================================================
      -->
            <v-col xs="4" sm="3" md="2">
                <div class="info--text font-weight-medium">{{ props.detail.title }}</div>
            </v-col>
            <!--
      =====================================================================================
        DETAIL INFO
      =====================================================================================
      -->
            <v-col v-if="!props.detail.txInput" xs="7" sm="8" md="9" class="pr-0">
                <div v-if="props.isLoading">
                    <v-row align-center justify-start mr-2>
                        <v-col xs="12" class="pa-0">
                            <v-progress-linear color="lineGrey" value="40" indeterminate height="16" class="ma-0" />
                        </v-col>
                    </v-row>
                </div>
                <div v-else>
                    <div v-if="!isMono">
                        <router-link v-if="props.detail.link" :to="props.detail.link">
                            <div class="text-truncate secondary--text">{{ props.detail.detail }}</div>
                        </router-link>
                        <div v-else class="text-muted text-truncate detail-container">
                            <span class="pr-1">{{ props.detail.detail }}</span>
                            <app-tooltip v-if="props.detail.tooltip" :text="props.detail.tooltip" />
                            <v-row
                                v-if="props.detail.priceChange && percentageChange.value"
                                :class="[props.detail.tooltip ? 'pl-3' : 'pl-2', priceChangeClass, 'price-container', 'font-weight-medium', 'my-0 ml-0']"
                                row
                                wrap
                                align="center"
                                justify="start"
                            >
                                (<span class="pl-1">{{ percentageChange.value }}%</span>
                                <v-icon :color="priceChangeSymbol === '-' ? 'red' : 'green'" size="x-small">
                                    {{ priceChangeSymbol === '-' ? 'south_east' : 'north_east' }} </v-icon
                                >)
                            </v-row>
                        </div>
                    </div>
                    <div v-else>
                        <app-transform-hash
                            v-if="props.detail.toChecksum"
                            :hash="eth.toCheckSum(props.detail.detail)"
                            :link="props.detail.link"
                            :is-blue="showLink"
                        />
                        <app-transform-hash v-else :hash="props.detail.detail" :link="props.detail.link" :is-blue="showLink" />
                    </div>
                </div>
            </v-col>
            <v-col v-if="!props.detail.txInput" xs="1" class="pt-0 pb-0 pl-1">
                <app-copy-to-clip v-if="props.detail.copy" :value-to-copy="props.detail.detail" />
            </v-col>
            <v-col v-if="props.detail.txInput && !smAndDown" sm="9" md="10">
                <div class="data-input pa-3 break-string">
                    <p class="mb-2">{{ props.detail.txInput }}</p>
                </div>
            </v-col>
        </v-row>
        <v-row v-if="props.detail.txInput" align="start" justify="start" class="mr-0 ml-0">
            <v-col v-if="!mdAndUp" xs="12" pt-0>
                <div class="data-input pa-2 break-string">
                    <p class="mb-2">{{ props.detail.txInput }}</p>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Detail } from '@/core/components/props'
import AppCopyToClip from '@/core/components/AppCopyToClip.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppTooltip from '@/core/components/AppTooltip.vue'
import BN from 'bignumber.js'
import { formatPercentageValue, FormattedNumber } from '@/core/helper/number-format-helper'
import { eth } from '@/core/helper/eth'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { smAndDown, mdAndUp } = useDisplay()

interface Props {
    detail: Detail
    isLoading: boolean
}
const props = defineProps<Props>()

const priceChangeClass = computed<string>(() => {
    const change = props.detail.priceChange || 0
    if (change > 0) {
        return 'text-green'
    }
    if (change < 0) {
        return 'text-red'
    }
    return 'black--text'
})

const isMono = computed<boolean>(() => {
    return !!props.detail.mono
})

const showLink = computed<boolean>(() => {
    return !!props.detail.link
})

const priceChangeSymbol = computed<string>(() => {
    const change = props.detail.priceChange || 0
    if (change > 0) {
        return '+'
    }
    if (change < 0) {
        return '-'
    }
    return ''
})

const percentageChange = computed<FormattedNumber>(() => {
    const change = props.detail.priceChange || 0
    return formatPercentageValue(new BN(change))
})
</script>

<style scoped lang="css">
.data-input {
    background-color: #2d2d2d;
    color: #cc99cd;
    max-height: 160px;
    overflow: scroll;
}
.detail-container {
    display: flex;
}
.price-container {
    margin-bottom: 0 !important;
}
</style>
