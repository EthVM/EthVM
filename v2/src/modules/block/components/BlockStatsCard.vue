<template>
    <v-card elevation="1" rounded="xl" class="h-100">
        <v-row justify="start" align="start" align-lg="center" class="py-4 px-3 px-sm-6 px-md-4 px-lg-6" no-gutters>
            <v-col cols="2" md="3">
                <v-img :src="props.img" :max-width="maxWidth" :min-width="maxWidth" contain class="ml-auto ml-md-0 ml-lg-auto"></v-img>
            </v-col>
            <v-col cols="10" md="9">
                <div class="ml-4 d-flex flex-column">
                    <p class="text-info text-capitalize">{{ props.title }}</p>
                    <div v-if="!props.isLoading">
                        <p v-if="!props.isDate" class="text-h4 text-subtitle-1 font-weight-bold">
                            {{ props.value }} <span>{{ props.metrics }}</span>
                        </p>
                        <p v-else class="text-h4 text-subtitle-1 font-weight-bold pb-0">
                            {{ timeFrom }} <span>{{ props.metrics }}</span>
                        </p>
                    </div>
                    <v-col v-else cols="12" class="pa-0">
                        <div class="skeleton-box rounded-xl ml-n1" style="min-height: 24px; width: 100px"></div>
                    </v-col>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { mdAndDown } = useDisplay()

// refs
const timeFrom = ref(0)
const interval = ref(0)

const props = defineProps({
    value: {
        type: String,
        required: true
    },
    title: String,

    metrics: String,

    isDate: {
        type: Boolean,
        default: false
    },
    isLoading: Boolean,
    img: {
        type: String,
        required: true
    }
})

const maxWidth = computed<string>(() => {
    return mdAndDown.value ? '40' : '56'
})

const startTimer = () => {
    if (interval.value) {
        clearInterval(interval.value)
    }
    interval.value = setInterval(() => {
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
    if (props.isDate) {
        timeFrom.value = parseInt(((new Date().getTime() - new Date(props.value).getTime()) / 1000).toString())
        startTimer()
    }
})
</script>
