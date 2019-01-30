<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <v-card color="white" flat :class="{ 'pa-1': $vuetify.breakpoint.xsOnly, 'pa-3': $vuetify.breakpoint.smOnly, 'pa-5': $vuetify.breakpoint.mdAndUp }">
          <v-layout wrap grid-list-sm align-center column fill-height pa-2>
            <v-flex xs12 align-self-start>
              <v-card-title class="display-1 font-weight-bold pb-1">{{$t('footer.privPolicy')}}</v-card-title>
              <v-card-text>This is a Privacy Policy blah blah, waiting to get it</v-card-text>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    AppBreadCrumbs
  }
})
export default class PagePrivacyPolicy extends Vue {
  // Computed
  get crumbs() {
    return [
      {
        text: this.$i18n.t('footer.privPolicy'),
        disabled: true
      }
    ]
  }
}
</script>
