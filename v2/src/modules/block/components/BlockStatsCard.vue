<template>
    <v-card :color="getColor" :class="getBackground" flat class="mt-1 pr-1 white--text info-card" height="150px">
        <v-container fluid wrap fill-height row>
            <v-row v-if="!props.isLoading" xs="12" class="my-0 text-white">
                <p v-if="!props.isDate" class="text-h4 text-truncate font-weight-medium pb-0 pl-1 mb-0">{{ props.value }}</p>
                <p v-else class="text-h4 text-truncate font-weight-medium pb-0 pl-1 mb-0">{{ timeFrom }}</p>
                <p v-if="props.metrics" class="headline pl-1 mb-0">{{ props.metrics }}</p>
            </v-row>
            <v-row v-else xs="12" class="my-0">
                <v-progress-linear :color="colorLoading" background-color="white" background-opacity="0.3" value="40" indeterminate height="21" class="ma-0" />
            </v-row>
            <v-row xs="12" class="my-0">
                <v-card-text class="text-uppercase pt-0 pl-1 mt-4 text-white">{{ props.title }}</v-card-text>
            </v-row>
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

// refs
const timeFrom = ref(0)
let interval

const props = defineProps({
    value: String,
    title: String,
    colorType: String,
    metrics: String,
    backType: String,
    isDate: {
        type: Boolean,
        default: false
    },
    isLoading: Boolean
})

const getColor = computed<string>(() => {
    return props.colorType
})

const colorLoading = computed<string>(() => {
    return `${props.colorType}Light`
})

const getBackground = computed<string>(() => {
    return props.backType
})

const startTimer = () => {
    if (interval) {
        clearInterval(interval)
    }
    interval = setInterval(() => {
        timeFrom.value += 1
    }, 1000)
}

watch(
    () => props.value,
    () => {
        if (props.isDate) {
            timeFrom.value = 0
            startTimer()
        }
    }
)

onMounted(() => {
    timeFrom.value = parseInt((new Date().getTime() - new Date(props.value).getTime()) / 1000)
    startTimer()
})
</script>
