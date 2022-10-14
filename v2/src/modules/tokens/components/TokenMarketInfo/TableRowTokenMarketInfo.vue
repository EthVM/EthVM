<template>
    <div class="position-relative">
        <v-row align="center" justify="start" class="mt-5" :class="!state.showMoreDetails ? 'mb-5' : 'mb-1'" @click="toggleMoreDetails">
            <v-col cols="6" sm="6" md="4" lg="4">
                <v-row align="center" class="ma-0 flex-nowrap">
                    <app-btn-icon :icon="isFav ? 'star' : 'star_outline'" @click="setFavoriteToken" />
                    <div class="mr-4 ml-5">
                        <v-img :src="tokenImage" width="25px" height="25px" />
                    </div>
                    <div style="display: grid">
                        <router-link
                            v-if="props.token.symbol || props.token.name"
                            :to="`/token/${props.token.contract}`"
                            class="text-body-1 text-link text-ellipses"
                        >
                            <p class="text-textPrimary text-ellipses">{{ props.token.name }}</p>
                            <span v-if="props.token.symbol" class="text-info text-uppercase text-ellipses">{{ props.token.symbol }}</span>
                        </router-link>
                        <div v-else>
                            <p>Contract:</p>
                            <app-transform-hash :hash="eth.toCheckSum(props.token.contract)" :link="`/token/${props.token.contract}`" />
                        </div>
                    </div>
                </v-row>
            </v-col>
            <v-col cols="3" md="2">
                <p class="mb-0">
                    {{ props.token.getPriceFormatted() }}
                </p>
            </v-col>
            <v-col cols="2" sm="3" md="2">
                <p :class="priceChangeClass">{{ props.token.getPriceChangeFormatted() }}</p>
            </v-col>
            <v-col md="2" class="d-none d-md-block">
                <p class="mb-0">
                    {{ props.token.getVolumeFormatted() }}
                </p>
            </v-col>
            <v-col md="2" class="d-none d-md-block">
                <p class="mb-0">
                    {{ props.token.getMarketCapFormatted() }}
                </p>
            </v-col>
        </v-row>
        <div v-if="state.showMoreDetails" class="pb-5 text-subtitle-2 font-weight-regular">
            <v-row>
                <v-col>
                    <div>
                        <p class="text-info">Volume</p>
                        <p class="mb-0">
                            {{ props.token.getVolumeFormatted() }}
                        </p>
                    </div>
                </v-col>
                <v-col>
                    <div>
                        <p class="text-info">Market Cap</p>
                        <p class="mb-0">
                            {{ props.token.getMarketCapFormatted() }}
                        </p>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div v-if="state.showMoreDetails" class="row-bg bg-tableGrey"></div>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { TokenMarket } from '@module/address/models/TokenSort'
import { computed, reactive, ref } from 'vue'
import { eth } from '@core/helper'
import { useDisplay } from 'vuetify'
import { useStore } from '@/store'

const { smAndDown } = useDisplay()

interface ComponentProps {
    token: TokenMarket
}

const props = defineProps<ComponentProps>()

interface ComponentState {
    showMoreDetails: boolean
}

const state: ComponentState = reactive({
    showMoreDetails: false
})

const tokenImage = computed<string>(() => {
    return props.token.image === '' ? require('@/assets/icon-token.png') : props.token.image
})

const priceChangeClass = computed<string>(() => {
    const change = props.token.price_change_percentage_24h || 0

    if (change > 0) {
        return 'text-success'
    }
    if (change < 0) {
        return 'text-error'
    }
    return 'text-textPrimary'
})

const toggleMoreDetails = (): void => {
    // Only toggle details if on mobile view
    if (smAndDown.value) {
        state.showMoreDetails = !state.showMoreDetails
    }
}
const store = useStore()

const isFav = computed<boolean>(() => {
    return store.tokenIsFav(props.token.contract || '')
})
const setFavoriteToken = (): void => {
    isFav.value ? store.removeFavToken(props.token.contract || '') : store.addFavToken(props.token.contract || '')
}
</script>
