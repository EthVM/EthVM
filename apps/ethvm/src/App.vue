<template>
  <v-app style="background: #f3f4f8;">
    <navigation></navigation>
    <v-content>
      <router-view :key="$route.fullPath" />
      <block-footer></block-footer>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'app',
  data() {
    return {
      pageName: '/'
    }
  }
})
</script>
