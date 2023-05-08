<template>
    <div>
        <v-img
            cover
            :src="imagePreview"
            @error="imgLoadFail"
            :height="height"
            :max-width="width"
            :width="width"
            class="border-radius-default img-clickable align-end"
            @click="setDialog(true)"
        >
            <div
                v-if="imagePreview === require('@/assets/icon-nft.png') && displayNoImageMes"
                class="no-image text-uppercase text-caption text-center py-2 justify-end"
            >
                image not available
            </div>
            <div v-if="balance" class="nft-balance text-caption text-center px-3 py-2 rounded-pill elevation-4">{{ balance }}</div>
        </v-img>
        <app-dialog v-model="state.showDetails" @update:modelValue="setDialog" width="656" :height="supportsNft ? '550' : '340'">
            <template v-if="state.showDetails" #no-scroll-content>
                <v-carousel hide-delimiters :show-arrows="!xs && tokens !== undefined" :height="supportsNft ? '550' : '340'">
                    <template #prev="{ props }">
                        <app-btn-icon icon="chevron_left" @click="props.onClick" size="large" />
                    </template>
                    <template #next="{ props }">
                        <app-btn-icon icon="chevron_right" @click="props.onClick" size="large" />
                    </template>
                    <v-carousel-item v-for="(token, index) in displayTokens" :key="index" class="overflow-y-auto">
                        <token-nft-details :nft="token" />
                    </v-carousel-item>
                </v-carousel>
            </template>
        </app-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { NFTDetails } from './propModel'
import TokenNftDetails from './TokenNftDetails.vue'
import AppDialog from '@core/components/AppDialog.vue'
import AppBtnIcon from '@/core/components/AppBtnIcon.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import BigNumber from 'bignumber.js'
import { formatFloatingPointValue } from '@core/helper/number-format-helper'
import { useNetwork } from '@core/composables/Network/useNetwork'

const { xs } = useDisplay()
const { supportsNft } = useNetwork()

interface PropType {
    nft: NFTDetails
    loading: boolean
    height?: string
    width?: string
    index?: number
    tokens?: NFTDetails[]
}

const props = withDefaults(defineProps<PropType>(), {
    height: '58'
})
interface ComponentState {
    imageExists: boolean
    showDetails: boolean
}

const state: ComponentState = reactive({
    imageExists: true,
    showDetails: false
})

/*
===================================================================================
  Methods:
===================================================================================
*/
/**
 * Image loading failed catcher
 */
const imgLoadFail = (): void => {
    state.imageExists = false
}

/**
 * Opens/closes details dialog
 */
const setDialog = (_value: boolean) => {
    state.showDetails = _value
}

/*
===================================================================================
  Computed Values
===================================================================================
*/

const displayNoImageMes = computed<boolean>(() => {
    return new BigNumber(props.height).gte(100)
})

const balance = computed<string | undefined>(() => {
    return props.nft.balance ? formatFloatingPointValue(new BigNumber(props.nft.balance)).value : undefined
})

const displayTokens = computed<NFTDetails[]>(() => {
    if (props.tokens && props.index !== undefined) {
        if (props.index > 0) {
            const start = props.tokens.slice(props.index, props.tokens.length)
            const end = props.tokens.slice(0, props.index)
            return start.concat(end)
        }
        return props.tokens
    }
    return [props.nft]
})

const imagePreview = computed<string>(() => {
    if (!props.loading && state.imageExists) {
        if (props.nft.meta) {
            return props.nft.meta.previews.image_small_url
                ? props.nft.meta.previews.image_small_url
                : props.nft.meta.image_url
                ? props.nft.meta.image_url
                : require('@/assets/icon-nft.png')
        }
    }
    return require('@/assets/icon-nft.png')
})
</script>
<style lang="scss" scoped>
.img-clickable {
    cursor: pointer;
}
.border-radius-default {
    border-radius: 8px;
}

.carusel-icon {
    font-size: 20px;
}

.no-image {
    background-color: rgb(var(--v-theme-primary));
    color: rgba(255, 255, 255, 0.5);
    min-height: 36px;
    width: 100%;
}

.nft-balance {
    background-color: rgb(var(--v-theme-secondary));
    color: white;
    position: absolute;
    top: 10px;
    right: 10px;
    min-width: 58px;
}
</style>
