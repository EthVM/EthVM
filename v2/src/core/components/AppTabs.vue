<template>
    <v-tabs v-model="state.activeTab" :density="xs ? 'compact' : 'default'" color="tabActive" end @update:model-value="changeTab" class="mr-2 mr-sm-10">
        <v-tab v-for="(i, index) in props.tabs" :key="index" :value="i.value" class="text-h6 rounded-t-xl text-uppercase">{{ i.title }}</v-tab>
    </v-tabs>
</template>

<script setup lang="ts">
import { defineEmits, watch, reactive } from 'vue'
import { Tab } from '@core/components/props'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'

const { xs } = useDisplay()
interface PropType {
    modelValue: string
    tabs: Tab[]
    routes: string[]
}
const props = defineProps<PropType>()

const emit = defineEmits<{
    (e: 'update:modelValue', tabId: string): void
}>()

// const activeTab = ref(props.modelValue)

const state = reactive({
    activeTab: props.modelValue
})

const router = useRouter()
const route = useRoute()
/**
 * Sets active tab id to param
 * and update active tab and
 * emit tab id to parent
 *
 * @param {string} activeTab
 */
const changeTab = (): void => {
    console.log('ChangeTab')
    if (route.query.t !== state.activeTab) {
        router.push({
            query: { t: state.activeTab }
        })
    }
    emit('update:modelValue', state.activeTab)
}

/**
 * Watching changes from the parent
 * Used for manual router history manupulation
 */
watch(
    () => props.modelValue,
    newVal => {
        if (newVal !== state.activeTab) {
            console.log('update inside tab')
            state.activeTab = newVal
        }
    }
)

/**
 * Watches for changes in the router
 * in case user manipulates history
 * and updates tab accordingly
 */
onBeforeRouteUpdate(async to => {
    console.log('BEFORE ROUTE UPDATE', to.query)
    if (to.query.t && to.query.t !== state.activeTab) {
        if (typeof to.query.t === 'string') {
            const exhists = props.routes.find(i => i === to.query.t)
            if (exhists) {
                state.activeTab = to.query.t
                emit('update:modelValue', state.activeTab)
            }
        }
    }
})
</script>

<style lang="css">
.tabs-capitilize {
    height: 4px;
    text-transform: capitalize !important;
}
</style>
