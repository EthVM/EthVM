<template>
  <div id="nav">
    <v-navigation-drawer v-model="drawer" fixed clipped class="white" app>
      <v-list dense class="white">
        <div v-for="item in items" :key="item.text">
          <v-layout v-if="item.heading" row align-center>
            <v-flex xs12>
              <v-subheader v-if="item.heading" class="pl-4">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
          </v-layout>
          <v-divider v-else-if="item.divider" dark class="my-3"></v-divider>
          <v-list-tile v-else v-model="item.routerLink">
            <v-btn flat block depressed light :to="item.routerLink">
              <v-list-tile-action>
                <v-icon color="blue darken-4">{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <span class="black--text text-capitalize font-weight-light">
                    {{ item.text }}
                  </span>
              </v-list-tile-content>
            </v-btn>
          </v-list-tile>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue darken-4" app fixed clipped-left>
      <v-flex sm4 md5>
        <v-layout row>
          <v-btn icon @click.native="drawer = !drawer">
            <v-icon class="fa fa-bars white--text"></v-icon>
          </v-btn>
          <v-img src="~@/assets/logo-white.png">LOGO HERE</v-img>
        </v-layout>
      </v-flex>
      <v-flex sm8 md7>
        <block-search></block-search>
      </v-flex>
    </v-toolbar>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['transactions', 'showheader', 'account', 'filter', 'total', 'isPending'],
  data() {
    return {
      drawer: null,
      items: [
        {
          icon: 'fa fa-home',
          text: this.$i18n.t('title.home'),
          routerLink: '/'
        },
        {
          divider: true
        },
        {
          heading: this.$i18n.t('title.blocks')
        },
        {
          icon: 'fa fa-cubes',
          text: this.$i18n.t('title.viewAll'),
          routerLink: '/blocks'
        },
        {
          icon: 'fa fa-cube',
          text: this.$i18n.t('title.uncles'),
          routerLink: '/about'
        },
        {
          divider: true
        },
        {
          heading: this.$i18n.t('title.tx')
        },
        {
          icon: 'fa fa-exchange',
          text: this.$i18n.t('title.mined'),
          routerLink: '/transactions'
        },
        {
          icon: 'fa fa-question',
          text: this.$i18n.t('title.pending'),
          routerLink: '/pending'
        },
        {
          divider: true
        },
        {
          heading: this.$i18n.t('title.tokens')
        },
        {
          icon: 'fa fa-file',
          text: this.$i18n.t('title.tokenCntrc'),
          routerLink: '/about'
        },
        {
          icon: 'fa fa-dollar',
          text: this.$i18n.t('title.tokenPrice20'),
          routerLink: '/about'
        },
        {
          icon: 'fa fa-dollar',
          text: this.$i18n.t('title.tokenPrice721'),
          routerLink: '/about'
        },
        {
          divider: true
        },
        {
          heading: this.$i18n.t('common.more')
        },
        {
          icon: 'fa fa-line-chart',
          text: this.$i18n.t('title.charts'),
          routerLink: '/charts'
        },
        {
          icon: 'fa fa-users',
          text: this.$i18n.t('title.about'),
          routerLink: '/about'
        },
        {
          icon: 'fa fa-info',
          text: this.$i18n.t('title.kb'),
          routerLink: '/about'
        }
      ]
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/addressTxTable.less';
</style>
