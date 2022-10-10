<template>
    <v-card elevation="1" rounded="xl">
        <v-row justify="start" align="center" class="py-4 pl-3 pl-sm-6">
            <!-- <v-btn icon color="info" height="34px" width="34px" @click.stop="btnClick()">
                <v-icon icon="bar_chart"></v-icon>
            </v-btn> -->
            <v-img :src="props.img" :max-width="[xs ? '40' : '56']" contain class="ml-sm-8 ml-md-0 ml-lg-8"></v-img>
            <div class="ml-2 ml-sm-4">
                <p class="text-info">{{ props.title }}</p>
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
        </v-row>
    </v-card>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs } = useDisplay()

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
