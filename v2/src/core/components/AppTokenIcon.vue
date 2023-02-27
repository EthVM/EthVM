<template>
    <div class="token-icon-core" :style="loaderStyle">
        <div v-if="loadingCoinData" class="skeleton-box skeleton-box-icon" :style="loaderStyle"></div>
        <v-img v-else :src="image" contain @error="imgLoadFail" :height="size" :width="size" class="token-icon"></v-img>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'

interface PropType {
    tokenIcon?: string
    imgSize?: string
}

const props = defineProps<PropType>()

const imageExists = ref(true)

const { loading: loadingCoinData } = useCoinData()

/**
 * Image loading failed catcher
 */
const imgLoadFail = (): void => {
    imageExists.value = false
}

const image = computed<string>(() => {
    if (props.tokenIcon && imageExists.value) {
        return props.tokenIcon
    }
    return require('@/assets/icon-token.png')
})

const size = computed<string>(() => {
    return props.imgSize || '32px'
})

const loaderStyle = computed<string>(() => {
    return `height: ${size.value}; width: ${size.value};`
})
</script>
<style lang="scss" scoped>
.skeleton-box-icon {
    border-radius: 50%;
    display: inline-block;
}
.token-icon-core {
    border-radius: 50%;
    box-shadow: 0px 0px 1px rgba(24, 43, 75, 0.08);
    background-color: rgb(var(--v-theme-white));
}
.token-icon {
    border-radius: 50%;
    box-shadow: 0px 3px 5px rgba(24, 43, 75, 0.2);
    border: 1px solid rgb(var(--v-theme-white));
    background-color: rgb(var(--v-theme-white));
}
</style>
