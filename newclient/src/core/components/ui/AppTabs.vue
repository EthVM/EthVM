<template>
    <v-card color="white" flat>
        <v-layout pr-2 pl-2 pt-1>
            <!--
    =====================================================================================
      Mobile
    =====================================================================================
    -->
            <v-flex hidden-md-and-up>
                <div class="mobile-select-tab">
                    <v-select
                        v-model="activeTabId"
                        :items="tabs"
                        item-text="title"
                        item-value="id"
                        color="accent"
                        solo
                        flat
                        height="32"
                        hide-details
                        class="primary--text"
                        @change="setTab"
                    ></v-select>
                </div>
            </v-flex>
            <!--
    =====================================================================================
      Desktop
    =====================================================================================
    -->
            <v-flex hidden-sm-and-down pa-0>
                <v-tabs
                    v-model="activeTab"
                    :class="{ 'pl-0 pr-0': $vuetify.breakpoint.smAndDown, 'pt-1': $vuetify.breakpoint.mdAndUp }"
                    color="white"
                    show-arrows
                    @change="$emit('changeTab', $event)"
                >
                    <v-tab
                        v-for="item in tabs"
                        :key="item.id"
                        :href="`#tab-${item.id}`"
                        class="info--text text-capitalize pb-1 tab-opacity"
                        active-class="primary--text "
                        ripple
                        >{{ item.title }}</v-tab
                    >
                    <v-tabs-slider color="primary" class="mb-0 tabs-slider" />
                </v-tabs>
            </v-flex>
        </v-layout>
        <v-tabs-items v-model="activeTab" class="tabs-items">
            <v-container :class="tabContainerClass" grid-list-xs> <slot name="tabs-item" /></v-container>
        </v-tabs-items>
    </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tab } from '@app/core/components/props'
import { TranslateResult } from 'vue-i18n'

@Component
export default class AppTabs extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Array) tabs!: Tab[]

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    activeTab = 'tab-0'
    activeTabId = 0

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */

    setTab() {
        this.tabs.forEach(tab => {
            if (this.activeTabId === tab.id) {
                tab.isActive = true
                this.activeTab = `tab-${this.activeTabId}`
                this.$emit('changeTab', `tab-${tab.id}`) // Notify parent of tab change
            } else {
                tab.isActive = false
            }
        })
    }

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    get tabContainerClass(): string {
        return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm' ? 'pa-0' : 'pa-2'
    }
}
</script>

<style lang="css">
.mobile-select-tab {
    border: 1px solid #4a67c6;
    border-radius: 2px;
    padding: 10px;
}

.v-select__selections {
    color: #6270fc !important;
}

.tabs-slider {
    height: 4px;
}

.tabs-items {
    border-top: 1px solid #efefef;
}
</style>
