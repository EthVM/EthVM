<template>
  <v-tabs v-model="active" dark color="white" slider-color="primary" show-arrows>
    <v-tab v-for="(item, index) in tabs" class="grey--text" active-class="primary--text" :href="'#tab-' + item" :key="index" @click="setActive(item)">{{
      item.title
    }}</v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tab } from '@app/components/props'

@Component
export default class AppTabs extends Vue {
  @Prop(Array) tabs!: Tab[]

  setActive(tab) {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].isActive = false
    }
    tab.isActive = true
  }
}
</script>
