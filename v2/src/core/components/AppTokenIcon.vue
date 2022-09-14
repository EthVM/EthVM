<template>
    <div class="token-icon-core" :style="loaderStyle">
        <div v-if="!props.tokenIcon" class="skeleton-box skeleton-box-icon"></div>
        <v-img v-else :src="image" contain @error="imgLoadFail" :max-height="size" :max-width="size" class="token-icon"></v-img>
    </div>
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
.skeleton-box-icon {
    border-radius: 50%;
    display: inline-block;
}
.token-icon-core {
    border-radius: 50%;
    box-shadow: 0px 0px 1px rgba(24, 43, 75, 0.08);
}
.token-icon {
    border-radius: 50%;
    box-shadow: 0px 3px 5px rgba(24, 43, 75, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.02);
}
</style>
