<template>
  <v-app style="background: #f3f4f8;">
    <the-navigation-drawer />
    <v-content>
      <router-view :key="$route.path" />
      <the-footer />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import TheNavigationDrawer from '@app/core/components/layout/TheNavigationDrawer.vue'
import TheFooter from '@app/core/components/layout/TheFooter.vue'
import { Vue, Component } from 'vue-property-decorator'
import 'vuetify/dist/vuetify.min.css'

@Component({
  components: {
    TheNavigationDrawer,
    TheFooter
  }
})
export default class App extends Vue {}
</script>

<style scoped lang="css">
@import '~cssPath/global.css';
</style>
