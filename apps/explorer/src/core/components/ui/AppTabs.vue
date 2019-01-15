<template>
  <v-card color="white" flat>
    <v-tabs
      v-model="activeTab"
      color="white"
      show-arrows
      :class="{ 'pl-0 pr-0': $vuetify.breakpoint.smAndDown, 'pl-3 pr-3': $vuetify.breakpoint.mdAndUp, 'pt-2': $vuetify.breakpoint.mdAndUp }"
    >
      <v-tab
        v-for="item in tabs"
        class="info--text text-capitalize pb-2 tab-opacity"
        active-class="primary--text "
        :key="item.id"
        :href="'#tab-' + item.id"
        ripple
        >{{ item.title }}</v-tab
      >
      <v-tabs-slider color="primary" class="mb-0" style="height: 4px;"></v-tabs-slider>
    </v-tabs>
    <v-tabs-items v-model="activeTab" style="border-top: 1px solid #efefef">
      <v-container grid-list-sm class="mb-0"> <slot name="tabs-item"></slot></v-container
    ></v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tab } from '@app/core/components/props'

@Component
export default class AppTabs extends Vue {
  @Prop(Array) tabs!: Tab[]

  activeTab = 'tab-0'
}
</script>
