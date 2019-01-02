<template>
  <v-tabs v-model="active" dark color="white" slider-color="primary" show-arrows>
    <v-tab v-for="(item, index) in tabs" class="grey--text" active-class="primary--text" :href="'#tab-' + item" :key="index" v-on:click="setActive(item)">{{
      item.title
    }}</v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  props: ['tabs']
})
export default class AppTabs extends Vue {
  /* Tabs Object Array Example:
    tabs: [
      {
        id: 0,
        title: 'title1',
        isActive: true
      },
      {
        id: '1'
        title: 'title2',
        isActive: false
      } ..
    ]
   End Example */
  setActive(tab) {
    let i
    for (i = 0; i < this.tabs.length; i++) {
      this.tabs[i].isActive = false
    }
    tab.isActive = true
  }
}
</script>
