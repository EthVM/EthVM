<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <v-card color="white" flat :class="{ 'pa-1': $vuetify.breakpoint.xsOnly, 'pa-3': $vuetify.breakpoint.smOnly, 'pa-5': $vuetify.breakpoint.mdAndUp }">
          <v-layout wrap grid-list-sm align-center column fill-height pa-2>
            <v-flex xs12>
              <v-card-title class="display-1 font-weight-bold pb-1">{{ $t('about.title') }}</v-card-title>
              <v-card-text>{{ $t('about.text') }}</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap justify-start>
                <v-flex xs12 sm6 md3>
                  <button href="https://github.com/EthVM">
                    <v-layout justify-start pl-3><v-icon class="primary--text pl-2 fab fa-github" large></v-icon></v-layout>
                    <v-card-title class="title pb-1 ">{{ $t('social.git') }}</v-card-title>
                    <v-card-text class="text-xs-left">{{ $t('about.git') }}</v-card-text>
                  </button>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <button href="https://medium.com/@myetherwallet">
                    <v-layout justify-start pl-3><v-icon class="primary--text pl-2 fab fa-medium-m" large></v-icon></v-layout>
                    <v-card-title class="title pb-1">{{ $t('social.medium') }}</v-card-title>
                    <v-card-text class="text-xs-left">{{ $t('about.medium') }}</v-card-text>
                  </button>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <button href="https://twitter.com/Eth_VM">
                    <v-layout justify-start pl-3><v-icon class="primary--text pl-2 fab fa-twitter" large></v-icon></v-layout>
                    <v-card-title class="title pb-1">{{ $t('social.twitter') }}</v-card-title>
                    <v-card-text class="text-xs-left">{{ $t('about.twitter') }}.</v-card-text>
                  </button>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <button href="https://www.reddit.com/r/ethvm">
                    <v-layout justify-start pl-3><v-icon class="primary--text pl-2 fab fa-reddit text-xs-left" large></v-icon></v-layout>
                    <v-card-title class="title pb-1" href="https://www.reddit.com/r/ethvm">{{ $t('social.reddit') }}</v-card-title>
                    <v-card-text class="text-xs-left">{{ $t('about.reddit') }}</v-card-text>
                  </button>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-card-title class="display-1 font-weight-bold">{{ $t('disclaimer.title') }}</v-card-title>
              <v-card-text>{{ $t('disclaimer.text') }}</v-card-text>
              <v-card-text>{{ $t('disclaimer.mit') }}</v-card-text>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Crumb } from '@app/core/components/props'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    AppBreadCrumbs
  }
})
export default class PageAbout extends Vue {
  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get crumbs(): Crumb[] {
    return [
      {
        text: this.$i18n.t('title.about'),
        disabled: true
      }
    ]
  }
}
</script>
