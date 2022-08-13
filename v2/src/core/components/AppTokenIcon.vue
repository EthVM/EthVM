<template>
    <div v-if="!props.tokenIcon" class="skeleton-box" :style="loaderStyle"></div>
    <v-img v-else :src="image" contain @error="imgLoadFail" :max-height="size" :max-width="size"></v-img>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface PropType {
    tokenIcon?: string
    imgSize?: string
}

const props = defineProps<PropType>()

const imageExists = ref(true)

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
.skeleton-box {
    position: relative;
    background-color: rgb(var(--v-theme-loading));
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
    cursor: wait;

    &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, var(--v-skeleton-gradient)), rgba(255, 255, 255, 0));
        animation: loading 2s infinite;
        content: '';
    }

    @keyframes loading {
        100% {
            transform: translateX(100%);
        }
    }
}
</style>
