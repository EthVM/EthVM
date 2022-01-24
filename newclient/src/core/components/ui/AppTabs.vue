<template>
    <v-card color="white" flat>
        <v-layout>
            <!--
            =====================================================================================
              Mobile
            =====================================================================================
            -->
            <v-flex hidden-md-and-up pt-0 pb-0>
                <v-menu v-model="showMobile" offset-y>
                    <template #activator="{ on }">
                        <v-toolbar color="menuDark" class="toolbar-menu" flat v-on="on">
                            <v-layout row align-center justify-space-between pa-2>
                                <v-flex grow>
                                    <p class="white--text">{{ mobileText }}</p>
                                </v-flex>
                                <v-flex shrink>
                                    <v-btn icon small class="ma-0">
                                        <v-icon class="white--text small-global-icon-font asset-icon">{{ mobileIcon }} </v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-toolbar>
                    </template>
                    <v-list>
                        <v-list-tile v-for="tab in tabs" :key="tab.id" @click="setTab(tab.id)">
                            <v-list-tile-content>
                                <p :class="[tab.isActive ? 'primary--text' : '', 'body-1 pl-2']">{{ tab.title }}</p>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-flex>
            <!--
            =====================================================================================
              Desktop
            =====================================================================================
            -->
            <v-flex hidden-sm-and-down pa-0>
                <v-tabs v-model="activeTab" class="pr-2 pl-2 ml-3 mr-3 pt-1" color="white" show-arrows @change="$emit('change-tab', $event)">
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
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
    showMobile = false

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Sets active tab id to param
     * and update active tab and
     * emit tab id to parent
     *
     * @param id {Number} tabChange {Boolean} default false
     */
    setTab(id: number, tabChange = false): void {
        this.activeTabId = id >= this.tabs.length ? 0 : id
        this.tabs.forEach(tab => {
            if (this.activeTabId === tab.id) {
                tab.isActive = true
                if (!tabChange) {
                    this.activeTab = `tab-${this.activeTabId}`
                    this.$emit('changeTab', `tab-${tab.id}`) // Notify parent of tab change
                }
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

    get mobileText(): string {
        return this.tabs[this.activeTabId].title.toString()
    }
    get mobileIcon(): string {
        return this.showMobile ? 'fas fa-angle-up' : 'fas fa-angle-down'
    }

    @Watch('activeTab')
    onActiveTabChanged(newVal: string, oldVal: string) {
        if (newVal !== oldVal) {
            this.setTab(parseInt(newVal.substr(4, 1)), true)
        }
    }
}
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
