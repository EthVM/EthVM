<template>
    <div>
        <v-tabs
            v-if="!props.btnVariant"
            v-model="state.activeTab"
            density="compact"
            end
            @update:model-value="changeTab"
            hide-slider
            align-tabs="start"
            selected-class="font-weight-bold"
            class="px-3"
        >
            <v-tab
                v-for="(i, index) in tabs"
                :key="index"
                :value="i.value"
                min-width="30"
                :class="[xs ? 'text-body-1' : 'text-h6', 'rounded-lg text-capitalize font-weight-light px-3']"
                >{{ i.title }}</v-tab
            >
            <v-btn v-if="moreTabs.length > 0 && xs" variant="text" rounded="lg" class="align-self-center font-weight-light" height="100%" id="activator-mobile">
                more
            </v-btn>
            <app-menu v-if="moreTabs.length > 0 && xs" min-width="180" activator="#activator-mobile">
                <v-list-item v-for="tab in moreTabs" :title="tab.title" class="py-2" @click="changeTab(tab.value)" :key="tab.value"> </v-list-item>
            </app-menu>
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
import { defineEmits, watch, reactive, computed } from 'vue'
import { Tab } from '@core/components/props'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import AppMenu from '@core/components/AppMenu.vue'

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
const changeTab = (_value: string | undefined): void => {
    if (_value && _value !== state.activeTab) {
        state.activeTab = _value
    }
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

/**
 * Visible tabs, reduce number of tabs to 3 on XS
 */
const tabs = computed<Tab[]>(() => {
    if (!xs.value) {
        return props.tabs
    }
    if (props.tabs.length < 4) {
        return props.tabs
    }
    const start = props.tabs.findIndex(i => i.value === state.activeTab)
    const newTabs = props.tabs.slice(start, start + 3)
    if (newTabs.length < 3) {
        let i = 0
        while (newTabs.length < 3) {
            newTabs.push(props.tabs[i])
            ++i
        }
    }
    return newTabs
})

/**
 * More tabs, returns all tabs for the meny if more then 3 tabs
 */
const moreTabs = computed<Tab[]>(() => {
    if (props.tabs.length > 3 && xs.value) {
        return props.tabs
    }
    return []
})
</script>
