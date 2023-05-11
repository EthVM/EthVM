<template>
    <div v-if="!displayName" class="hash-container font-mono">
        <component :is="!hasLink ? 'div' : 'router-link'" :to="props.link || ''" :class="{ 'text-secondary': props.isBlue }">
            <div v-if="start" :class="props.isShort ? 'firstPartShort' : 'firstPart'">{{ start }}</div>
            <div class="lastPart">{{ end }}</div>
        </component>
    </div>
    <div v-else :class="['text-ellipses', { 'hash-container-short': props.isShort }]">
        <div v-if="!hasLink" :class="{ 'text-secondary': props.isBlue }">{{ displayName }}</div>
        <router-link v-else :to="props.link || ''" class="text-secondary">{{ displayName }}</router-link>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'
import { RouterLink } from 'vue-router'

const props = defineProps({
    hash: {
        type: String,
        required: true
    },
    link: String,
    isBlue: {
        type: Boolean,
        default: false
    },
    italic: {
        type: Boolean,
        default: false
    },
    isShort: {
        type: Boolean,
        default: false
    },
    showName: {
        type: Boolean,
        default: true
    }
})

const start = computed<string>(() => {
    const n = props.hash?.length
    const sliceStop = n - 5 > 5 ? n - 5 : 5
    return props.hash?.slice(0, sliceStop)
})

const end = computed<string>(() => {
    const n = props.hash?.length
    const sliceStart = n - 5 > 5 ? n - 5 : 5
    return props.hash?.slice(sliceStart, n)
})

const hasLink = computed<boolean>(() => {
    return !!props.link && props.link !== ''
})

const store = useStore()

const displayName = computed<string | undefined>(() => {
    return props.showName ? store.getAddressName(props.hash) : undefined
})
</script>

<style scoped lang="scss">
// Variables to control the truncation behaviour
$startFixedChars: 2; // Number of chars before ellipsis - have priority over end chars
$endFixedChars: 5; // Number of chars after ellipsis  - lower priority than start chars
$fontFaceScaleFactor: 0.47; // Magic number dependent on font face - set by trial and error

// Dervied from the 3 variables above
$startWidth: 1em * $fontFaceScaleFactor * ($startFixedChars + 3);
$endWidth: 1em * $fontFaceScaleFactor * $endFixedChars;

.firstPart,
.firstPartShort,
.lastPart {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
}
.firstPart {
    max-width: calc(100% - #{$endWidth});
    min-width: $startWidth;
    text-overflow: ellipsis;
}

.firstPartShort {
    max-width: 55px;
    min-width: $startWidth;
    text-overflow: ellipsis;
}
.lastPart {
    max-width: calc(100% - #{$startWidth});
    direction: rtl;
}
.hash-container {
    white-space: nowrap;
    overflow: hidden;
}

.hash-container-short {
    width: 100px;
}

.text-overflow-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
