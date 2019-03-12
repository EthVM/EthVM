<template>
  <div id="nav">
    <!--
    =====================================================================================
      NAVIGATION DRAWER
    =====================================================================================
    -->

    <v-navigation-drawer v-model="drawer" :mini-variant="mini" class="primary elevation-3 pt-3" app mini-variant-width="100px">
      <v-layout column fill-height>
        <v-flex>
          <!--
          =====================================================================================
            LOGO
          =====================================================================================
          -->
          <v-layout v-if="mini" column>
            <v-img :src="require('@/assets/logo-compact.png')" height="70px" max-width="80px" contain class="mb-2 mt-2"></v-img>
            <v-img :src="require('@/assets/alpha.png')" height="18px" max-width="80px" contain class="mb-2"></v-img>
          </v-layout>
           <v-layout v-else align-end justify-start row >
            <v-img :src="require('@/assets/logo-white.png')" height="50px" max-width="130px" contain class="mb-4 mt-4 ml-2"></v-img>
            <v-img :src="require('@/assets/alpha.png')" height="18px" max-width="50px" contain class="mb-4 "></v-img>
          </v-layout>

          <!--
          =====================================================================================
            DRAWER ENTRIES
          =====================================================================================
          -->
          <v-list class="pa-0" two-line v-for="(item, index) in items" :key="index" v-model="item.active">
            <v-list-tile v-if="!item.links" class="nav--text pb-1" :to="item.header.routerLink" active-class="white--text accent" >
              <v-layout row align-center justify-start fill-height>
                <v-list-tile-action >
                  <v-icon class="mr-2 ml-2" small>{{ item.header.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.header.text }}</v-list-tile-title>
                </v-list-tile-content>
              </v-layout>
            </v-list-tile>
            <v-list-group v-else :class="[checkLinkPath(item.links) ? 'accent white--text' : 'nav--text']" @click="mini = false">
              <template v-slot:activator >
                  <v-icon class="ml-4 pl-1 pr-3" small>{{ item.header.icon }}</v-icon>
                <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.header.text }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
              </template>
              <div v-if="!mini">
              <v-list-tile v-for="(link, j) in item.links" :to="link.routerLink" :key="j">
                <v-list-tile-content>
                  <v-list-tile-title :class="[isCurrentLinkPath(link.name) ? 'white--text ml-5 pl-2' : 'nav--text ml-5 pl-2']">{{
                    link.text
                  }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              </div>
            </v-list-group>
          </v-list>
        </v-flex>
        <v-spacer />
        <!--
        =====================================================================================
          REPORT BUTTON
        =====================================================================================
        -->
        <v-flex v-if="!mini" >
          <v-layout align-center justify-end column fill-height pt-4 pb-5>
            <p class="white--text">{{ $t('message.report') }}</p>
            <v-btn outline color="bttnReport" class="text-capitalize font-weight-regular" :href="'mailto:' + supportEmail">{{ $t('bttn.report') }}</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
    <!--
    =====================================================================================
      TOOLBAR (TOGGLE MENU & SEARCH INPUT)
    =====================================================================================
    -->
    <v-toolbar color="white" app fixed clipped flat height="77px">
      <v-layout align-center row fill-height>
        <v-flex xs1>
          <v-layout row>
            <v-btn icon @click.stop="setDrawer">
              <v-icon class="fa fa-bars primary--text" />
            </v-btn>
          </v-layout>
        </v-flex>
        <v-spacer />
        <v-flex xs9 sm7 md6> <app-search /> </v-flex>
      </v-layout>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import AppSearch from '@app/core/components/ui/AppSearch.vue'
import { NavMenuEntry } from '@app/core/components/props'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    AppSearch
  }
})
export default class TheNavigationDrawer extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  supportEmail = 'support@ethvm.com'
  drawer = null
  active = 0
  sublink = null
  mini = null

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get items(): NavMenuEntry[] {
    return [
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
            routerLink: '/blocks',
            name: 'blocks'
          },
          {
            text: this.$i18n.t('title.uncles'),
            routerLink: '/uncles',
            name: 'uncles'
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
            routerLink: '/txs',
            name: 'transactions'
          }
          // {
          //   text: this.$i18n.t('title.pending'),
          //   routerLink: '/pending-txs',
          //   name: 'pending'
          // }
        ]
      },
      {
        header: {
          text: this.$i18n.t('title.tokens'),
          icon: 'fab fa-ethereum',
          routerLink: '/tokens'
        }
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

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setDrawer(): void {
    if  (this.$vuetify.breakpoint.name === 'lg' || this.$vuetify.breakpoint.name === 'xl') {
      this.drawer = true
      this.mini = !this.mini
    }
    else {
      this.mini = false
      this.drawer = !this.drawer
    }
  }


  getCurrentPath(): string {
    return this.$route.name ? this.$route.name : ''
  }

  isCurrentLinkPath(name: string): boolean {
    return this.getCurrentPath() == name
  }

  checkLinkPath(links: any[] = []): boolean {
    for (const link of links) {
      if (this.isCurrentLinkPath(link.name)) {
        return true
      }
    }
    return false
  }

}
</script>
