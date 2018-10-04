<template>
  <v-app>
    <navigation></navigation>
    <v-content>
      <router-view :key="$route.fullPath" />
      <!-- FOOTER -->
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

<style lang="less">

</style>
