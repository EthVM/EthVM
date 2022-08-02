<template>
    <v-card color="white" flat>
        <v-row class="ma-0">
            <!--
            =====================================================================================
              Mobile
            =====================================================================================
            -->
            <v-col v-if="!mdAndUp" class="pt-0 pb-0">
                <v-menu v-model="showMobile" offset-y>
                    <template #activator="{ on }">
                        <v-toolbar color="menuDark" class="toolbar-menu" flat v-on="on">
                            <v-row row align-center justify-space-between pa-2>
                                <v-col grow>
                                    <p class="white--text">{{ mobileText }}</p>
                                </v-col>
                                <v-col shrink>
                                    <v-btn icon size="small" class="ma-0">
                                        <v-icon class="white--text small-global-icon-font asset-icon">{{ mobileIcon }}</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-toolbar>
                    </template>
                    <v-list>
                        <v-list-item v-for="tab in props.tabs" :key="tab.id" @click="setTab(tab.id)">
                            <v-list-item-subtitle>
                                <p :class="[tab.isActive ? 'primary--text' : '', 'body-1 pl-2']">{{ tab.title }}</p>
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>
            <!--
            =====================================================================================
              Desktop
            =====================================================================================
            -->
            <v-col v-if="!smAndDown" class="pa-0">
                <v-tabs v-model="state.activeTab" color="primary" @change="$emit('change-tab', $event)">
                    <v-tab
                        v-for="item in props.tabs"
                        :key="item.id"
                        :value="`tab-${item.id}`"
                        class="text-capitalize pb-1"
                        :ripple="false"
                        slider-color="primary"
                    >
                        {{ item.title }}
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>
        <v-window v-model="state.activeTab" class="tabs-items">
            <v-container :class="tabContainerClass" grid-list-xs>
                <slot />
            </v-container>
        </v-window>
    </v-card>
</template>

<script setup lang="ts">
import { defineEmits, reactive, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { Tab } from '@core/components/props'

interface PropType {
    tabs: Tab[]
}
const props = defineProps<PropType>()

const emit = defineEmits<{
    (e: 'changeTab', tabId: string): void
}>()

interface ComponentState {
    activeTab: string
    activeTabId: number
    showMobile: boolean
}
const state: ComponentState = reactive({
    activeTab: 'tab-0',
    activeTabId: 0,
    showMobile: false
})

/**
 * Sets active tab id to param
 * and update active tab and
 * emit tab id to parent
 *
 * @param id {Number}
 * @param tabChange {Boolean} default false
 */
const setTab = (id: number, tabChange = false): void => {
    state.activeTabId = id >= props.tabs.length ? 0 : id
    props.tabs.forEach(tab => {
        if (state.activeTabId === tab.id) {
            tab.isActive = true
            if (!tabChange) {
                state.activeTab = `tab-${state.activeTabId}`
                emit('changeTab', `tab-${tab.id}`) // Notify parent of tab change
            }
        } else {
            tab.isActive = false
        }
    })
}

const { xs, sm, mdAndUp, smAndDown } = useDisplay()
const tabContainerClass = computed<string>(() => {
    return xs.value || sm.value ? 'pa-0' : 'pa-2'
})

const mobileText = computed<string>(() => {
    return props.tabs[state.activeTabId].title.toString()
})
const mobileIcon = computed<string>(() => {
    return state.showMobile ? 'chevron_up' : 'chevron_down'
})
watch(
    () => state.activeTab,
    (newVal: string, oldVal: string) => {
        if (newVal !== oldVal) {
            const id = parseInt(newVal.split('-')[1])
            setTab(id, true)
        }
    }
)
</script>

<style lang="css">
.tabs-slider {
    height: 4px;
}

.tabs-items {
    border-top: 1px solid #efefef;
}
.toolbar-menu {
    cursor: pointer;
}
.toolbar-menu:hover {
    background-color: #34475c !important;
    border-color: #34475c !important;
}
</style>
