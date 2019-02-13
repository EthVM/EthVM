<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <v-card color="white" flat :class="{ 'pa-1': $vuetify.breakpoint.xsOnly, 'pa-3': $vuetify.breakpoint.smOnly, 'pa-5': $vuetify.breakpoint.mdAndUp }">
          <v-layout wrap grid-list-xs align-center column fill-height pa-2 pb-4>
            <v-flex xs12 align-self-center>
              <v-card-title class="display-1 font-weight-bold pb-1">{{ $t('footer.privPolicy') }}</v-card-title>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.intro.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.intro.p1') }}</v-card-text>
              <v-card-text class="pb-0">{{ $t('pp.intro.p2') }}</v-card-text>
              <v-card-text class="pb-0">{{ $t('pp.intro.p3') }}</v-card-text>
              <v-card-text class="pb-0">{{ $t('pp.intro.p4') }}</v-card-text>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.block.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.block.p1') }}</v-card-text>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.collect.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.collect.p1') }}</v-card-text>
              <v-card-title class="subheading font-italic pb-0">{{ $t('pp.collect.sub1') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.collect.p2') }}</v-card-text>
              <v-card-title class="subheading font-italic pb-0">{{ $t('pp.collect.sub2') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.collect.p3') }}</v-card-text>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.use.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.use.p1') }}</v-card-text>
              <v-card-text class="pb-0">{{ $t('pp.use.p2') }}</v-card-text>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.sharing.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.sharing.p1') }}</v-card-text>
              <v-card-text class="pb-0">{{ $t('pp.sharing.p2') }}</v-card-text>
              <v-card-title class="subheading font-italic pb-0">{{ $t('pp.sharing.sub1') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.sharing.p3') }}</v-card-text>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.links.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.links.p1') }}</v-card-text>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.child.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.child.p1') }}</v-card-text>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.security.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.security.p1') }}</v-card-text>
              <v-card-text class="pb-0">{{ $t('pp.security.p2') }}</v-card-text>
              <v-card-text class="pb-0 pl-5">{{ $t('pp.security.b1') }}</v-card-text>
              <v-card-text class="pb-0 pl-5">{{ $t('pp.security.b2') }}</v-card-text>
              <v-card-text class="pb-0 pl-5">{{ $t('pp.security.b3') }}</v-card-text>
              <v-card-text class="pb-0 pl-5">{{ $t('pp.security.b4') }}</v-card-text>
              <v-card-text class="pb-0 pl-5">{{ $t('pp.security.b5') }}</v-card-text>
              <v-card-text class="pb-0 pl-5">{{ $t('pp.security.b6') }}</v-card-text>
              <v-card-text class="pb-0"
                >{{ $t('pp.security.p3') }}<a :href="'mailto:' + email">{{ email }}</a></v-card-text
              >
              <v-card-title class="subheading font-italic pb-0">{{ $t('pp.security.sub1') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.security.p4') }}</v-card-text>
              <v-card-text class="pb-0 pl-5">{{ $t('pp.security.b7') }}</v-card-text>
              <v-card-text class="pb-0 pl-5">{{ $t('pp.security.b8') }}</v-card-text>
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.contact.title') }}</v-card-title>
              <v-card-text class="pb-0"
                >{{ $t('pp.contact.p1') }} <a :href="'mailto:' + email">{{ email }}</a></v-card-text
              >
            </v-flex>
            <v-flex xs12 align-self-start>
              <v-card-title class="title font-weight-bold pb-1">{{ $t('pp.changes.title') }}</v-card-title>
              <v-card-text class="pb-0">{{ $t('pp.changes.p1') }}</v-card-text>
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
  email = 'privacy@EthVM.com'

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

<style scoped lang="css"></style>
