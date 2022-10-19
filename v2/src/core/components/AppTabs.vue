<template>
    <div>
        <v-tabs
            v-if="!props.btnVariant"
            v-model="state.activeTab"
            :density="xs ? 'compact' : 'default'"
            color="tabActive"
            end
            @update:model-value="changeTab"
            class="mr-2 mr-sm-10"
        >
            <v-tab v-for="(i, index) in props.tabs" :key="index" :value="i.value" class="text-h6 rounded-t-xl text-uppercase">{{ i.title }}</v-tab>
        </v-tabs>
        <v-row v-else>
            <v-btn
                v-for="(i, index) in props.tabs"
                :key="index"
                class="mx-1"
                color="textPrimary"
                :variant="i.value === state.activeTab ? 'flat' : 'outlined'"
                rounded="pill"
                height="24"
                @click="btnClick(i.value)"
                >{{ i.title }}</v-btn
            >
        </v-row>
    </div>
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
    btnVariant?: boolean
}
const props = withDefaults(defineProps<PropType>(), {
    btnVariant: false
})

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
const btnClick = (value: string): void => {
    state.activeTab = value
    emit('update:modelValue', state.activeTab)
}
/**
 * Sets active tab id to param
 * and update active tab and
 * emit tab id to parent
 *
 * @param {string} activeTab
 */
const changeTab = (): void => {
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
