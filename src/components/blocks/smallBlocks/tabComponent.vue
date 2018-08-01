<template>
  <div class="tabs-menu-container">
    <ul class="tabs">
      <li v-for="tab in tabs" v-bind:key="tab.id" v-on:click="setActive(tab)" v-bind:class="{active: tab.isActive}">{{tab.title}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'tabComponent',
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
  props: ['tabs'],
  data() {
    return {}
  },
  methods: {
    setActive(tab) {
      let i
      for (i = 0; i < this.tabs.length; i++) {
        this.tabs[i].isActive = false
      }
      tab.isActive = true
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/smallBlocks/tabComponent.less';
</style>
