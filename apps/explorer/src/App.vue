<template>
  <v-app style="background: #f3f4f8;">
    <the-navigation-drawer/>
    <v-content>
      <router-view></router-view>
      <!--<router-view :key="$route.fullPath"/ -->
      <the-footer/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import TheNavigationDrawer from '@app/components/app-layout/TheNavigationDrawer.vue'
import TheFooter from '@app/components/app-layout/TheFooter.vue'
import Vue from 'vue'

export default Vue.extend({
  name: 'app',
  components: {
    TheNavigationDrawer,
    TheFooter
  },
  //Add footer + nav declaration
  data() {
    return {
      pageName: '/'
    }
  }
})
</script>
