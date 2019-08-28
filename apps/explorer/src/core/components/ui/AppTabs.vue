<template>
  <v-card color="white" flat>
    <v-layout pa-2>
      <!--
    =====================================================================================
      Mobile
    =====================================================================================
    -->
      <v-flex hidden-sm-and-up>
        <div class="mobile-select-tab">
          <v-select
            v-model="activeTabId"
            :items="tabs"
            item-text="title"
            item-value="id"
            color="accent"
            solo
            flat
            @change="setTab"
            height="32"
            hide-details
            class="primary--text"
          ></v-select>
        </div>
      </v-flex>
      <!--
    =====================================================================================
      Desktop
    =====================================================================================
    -->
      <v-flex hidden-xs-only>
        <v-tabs
          v-model="activeTab"
          color="white"
          show-arrows
          :class="{ 'pl-0 pr-0': $vuetify.breakpoint.smAndDown, 'pl-3 pr-3 pt-2': $vuetify.breakpoint.mdAndUp }"
          @change="$emit('changeTab', $event)"
        >
          <v-tab
            v-for="item in tabs"
            class="info--text text-capitalize pb-2 tab-opacity"
            active-class="primary--text "
            :key="item.id"
            :href="`#tab-${item.id}`"
            ripple
            >{{ item.title }}</v-tab
          >
          <v-tabs-slider color="primary" class="mb-0 tabs-slider" />
        </v-tabs>
      </v-flex>
    </v-layout>
    <v-tabs-items v-model="activeTab" class="tabs-items">
      <v-container grid-list-xs :class="tabContainerClass"> <slot name="tabs-item"/></v-container>
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
    return this.$vuetify.breakpoint.name === 'xs' ? 'pa-0' : 'pa-2'
  }
}
</script>

<style lang="css">
.mobile-select-tab{
  border: 1px solid #4a67c6;
  border-radius: 2px;
  padding: 10px;
}

.v-select__selections{
  color:#6270fc !important;
}

  .tabs-slider {
    height: 4px;
  }

  .tabs-items {
    border-top: 1px solid #efefef
  }
</style>
