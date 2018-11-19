<template>
  <v-tabs v-model="active" dark color="white" slider-color="primary" show-arrows>
    <v-tab v-for="(item, index) in tabs" class="grey--text" active-class="primary--text" :href="'#tab-' + item" :key="index" v-on:click="setActive(item)">
       {{ item.title }}
    </v-tab>
  </v-tabs>
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
