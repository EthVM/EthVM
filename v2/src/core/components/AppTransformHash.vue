<template>
    <div class="hash-container font-mono">
        <div v-if="!hasLink" :class="props.isBlue ? `secondary--text` : `black--text`">
            <div class="firstPart">{{ start }}</div>
            <span v-if="props.isShort">...</span>
            <div class="lastPart">{{ end }}</div>
        </div>
        <router-link v-else :to="props.link || ''" :class="props.isBlue ? `text-secondary` : `black--text`">
            <div class="firstPart">{{ start }}</div>
            <span v-if="props.isShort">...</span>
            <div class="lastPart">{{ end }}</div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
    }
})

const firstPartCount = 5
const lastPartCount = 5

const start = computed<string>(() => {
    const n = props.hash?.length
    if (props.isShort) {
        return props.hash?.slice(0, firstPartCount)
    }
    return props.hash?.slice(0, n - 4)
})

const end = computed<string>(() => {
    const n = props.hash?.length
    if (props.isShort) {
        return props.hash?.slice(n - lastPartCount, n)
    }
    return props.hash?.slice(n - 4, n)
})

const hasLink = computed<boolean>(() => {
    return !!props.link && props.link !== ''
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
.lastPart {
    max-width: calc(100% - #{$startWidth});
    direction: rtl;
}
.hash-container {
    white-space: nowrap;
    overflow: hidden;
}
</style>
