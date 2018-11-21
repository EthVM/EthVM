<template>
  <v-container grid-list-lg class="mt-0">
    <v-card fluid flat color="transparent">
      <v-breadcrumbs large>
        <v-icon slot="divider">fa fa-arrow-right</v-icon>
        <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link"> {{ item.text }} </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-card>
    <v-layout row wrap> <block-latest-uncles :max-items="20" :showHeader="true" class="mt-3"></block-latest-uncles> </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FramesHome',
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
        {
          text: 'uncles',
          disabled: true
        }
      ]
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global';
</style>
