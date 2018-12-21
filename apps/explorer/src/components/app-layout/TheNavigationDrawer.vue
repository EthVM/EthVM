<template>
  <div id="nav">
    <v-navigation-drawer v-model="drawer" fixed floating class="primary elevation-3 pt-3" app width="260">
      <v-img :src="require('@/assets/logo-white.png')" height="50px" contain class="ma-4"></v-img>
      <v-list class="pa-0" two-line v-for="(item, index) in items" :key="index" v-model="item.active">
        <v-list-tile v-if="!item.links" class="nav--text" :to="item.header.routerLink" active-class="white--text accent" :prepend-icon="item.header.icon">
          <v-layout row align-center justify-start fill-height>
            <v-list-tile-action>
              <v-icon class="mr-2 ml-3">{{ item.header.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{ item.header.text }}</v-list-tile-title>
          </v-layout>
        </v-list-tile>
        <v-list-group v-else :class="[checkPath(item.links) ? 'accent white--text' : 'nav--text']">
          <v-list-tile slot="activator">
            <v-layout row align-center justify-start fill-height>
              <v-list-tile-action>
                <v-icon class="mr-2 ml-3">{{ item.header.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{ item.header.text }}</v-list-tile-title>
            </v-layout>
          </v-list-tile>
          <v-list-tile v-for="(link, j) in item.links" v-if="link.routerLink" :to="link.routerLink" :key="j">
            <v-list-tile-content>
              <v-list-tile-title :class="[checkLinkPath(link.routerLink) ? 'white--text ml-5 pl-2' : 'nav--text ml-5 pl-2']">{{ link.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="white" app fixed clipped flat height="77px">
      <v-layout align-center row fill-height>
        <v-flex xs1>
          <v-layout row>
            <v-btn icon @click.native="drawer = !drawer"> <v-icon class="fa fa-bars primary--text"></v-icon> </v-btn>
          </v-layout>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs9 sm7 md6> <app-search /> </v-flex>
      </v-layout>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import AppSearch from '@app/components/smart-components/AppSearch.vue'
import Vue from 'vue'
export default Vue.extend({
  name: 'TheNavigationDrawer',
  components: {
    AppSearch
  },
  data() {
    return {
      drawer: null,
      active: 0,
      sublink: null,
      items: [
        {
          header: {
            icon: 'fa fa-home',
            text: this.$i18n.t('title.home'),
            routerLink: '/'
          }
        },
        {
          header: {
            icon: 'fa fa-cubes',
            text: this.$i18n.t('title.blocks')
          },
          links: [
            {
              text: this.$i18n.t('title.viewAll'),
              routerLink: '/blocks'
            },
            {
              text: this.$i18n.t('title.uncles'),
              routerLink: '/uncles'
            }
          ]
        },
        {
          header: {
            text: this.$i18n.t('title.tx'),
            icon: 'fas fa-exchange-alt'
          },
          links: [
            {
              text: this.$i18n.t('title.mined'),
              routerLink: '/transactions'
            },
            {
              text: this.$i18n.t('title.pending'),
              routerLink: '/pending'
            }
          ]
        },
        {
          header: {
            text: this.$i18n.t('title.tokens'),
            icon: 'fab fa-ethereum'
          },
          links: [
            {
              text: this.$i18n.t('title.tokenCntrc')
              // routerLink: '/contracts',
            },
            {
              text: this.$i18n.t('title.tokenPrice20')
              // routerLink: '/prices',
            }
          ]
        },
        {
          header: {
            icon: 'fas fa-chart-pie',
            text: this.$i18n.t('title.charts'),
            routerLink: '/charts'
          }
        }
      ]
    }
  },
  methods: {
    getCurrPath() {
      let currPath = '/'
      if (this.$route.params.pageName) {
        currPath += this.$route.params.pageName
      }
      return currPath
    },
    checkLinkPath(link) {
      return this.getCurrPath() == link ? true : false
    },
    checkPath(links) {
      let i
      for (i = 0; i < links.length; i++) {
        if (this.checkLinkPath(links[i].routerLink)) {
          return true
        }
      }
      return false
    }
  }
})
</script>
