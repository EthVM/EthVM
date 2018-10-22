<template>
 <v-container grid-list-lg class="mt-0">
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <v-card fluid flat color="transparent">
          <v-breadcrumbs large>
            <v-icon slot="divider">fa fa-arrow-right</v-icon>
            <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link">
              {{ item.text }}
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
          <block-about></block-about>
      </v-flex>
    </v-layout>
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
          text: this.$i18n.t('title.about'),
          disabled: true
        }
      ]
    }
  },
  computed: {
    txs() {
      if (this.$store.getters.getTxs.length) {
        return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
      }
      return []
    }
  }
})
</script>

<style scoped lang="less">
//@import "~lessPath/sunil/frames/about.less";
</style>
