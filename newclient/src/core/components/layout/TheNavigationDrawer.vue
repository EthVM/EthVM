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
                    </v-layout>
                    <v-layout v-else align-end justify-start row>
                        <v-img :src="require('@/assets/logo-white.png')" height="50px" max-width="130px" contain class="mb-4 mt-4 ml-2"></v-img>
                    </v-layout>

                    <!--
                    =====================================================================================
                      DRAWER ENTRIES
                    =====================================================================================
                    -->
                    <v-list v-for="(item, index) in items" :key="index" v-model="item.active" class="pa-0" two-line>
                        <v-list-tile v-if="!item.links" :to="item.header.routerLink" class="nav--text pb-1" active-class="white--text accent">
                            <v-layout row align-center justify-start fill-height>
                                <v-list-tile-action>
                                    <v-icon class="mr-2 ml-2" small>{{ item.header.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.header.text }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-layout>
                        </v-list-tile>
                        <v-list-group v-else :class="[checkLinkPath(item.links) ? 'accent white--text' : 'nav--text']" @click="mini = false">
                            <template #activator>
                                <v-icon class="ml-4 pl-1 pr-3" small>{{ item.header.icon }}</v-icon>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ item.header.text }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </template>
                            <div v-if="!mini">
                                <v-list-tile v-for="(link, j) in item.links" :key="j" :to="link.routerLink">
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
                <v-flex v-if="!mini">
                    <v-layout align-center justify-end column fill-height pa-4>
                        <p class="white--text text-xs-center pb-2">{{ $t('message.report') }}</p>
                        <v-btn :href="`mailto:${supportEmail}`" outline color="bttnReport" class="text-capitalize font-weight-regular">{{
                            $t('btn.report')
                        }}</v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-navigation-drawer>
        <!--
        =====================================================================================
          TOOLBAR (TOGGLE MENU & SEARCH INPUT)
        =====================================================================================
        -->
        <v-toolbar :color="headerColor" :fixed="!showMobile" :scroll-threshold="200" :extended="showSearchMobile" app clipped flat>
            <!--
            =====================================================================================
              TOOLBAR  Mobile
            =====================================================================================
            -->
            <v-layout v-if="showMobile" align-center row fill-height>
                <v-flex shrink>
                    <v-layout align-end justify-start row fill-height>
                        <v-img :src="require('@/assets/logo-white.png')" height="30px" width="70px" contain></v-img>
                    </v-layout>
                </v-flex>
                <v-spacer />
                <v-flex v-if="!showSearchMobile" shrink>
                    <v-btn icon @click="showSearchMobile = true">
                        <v-icon class="fa fa-search white--text" />
                    </v-btn>
                </v-flex>
                <v-flex xs1>
                    <v-btn icon @click.stop="setDrawer">
                        <v-icon class="fa fa-bars white--text" />
                    </v-btn>
                </v-flex>
            </v-layout>
            <!--
            =====================================================================================
              TOOLBAR  Desktop
            =====================================================================================
            -->
            <v-layout v-else align-center row fill-height>
                <v-flex xs1>
                    <v-layout row>
                        <v-btn icon @click.stop="setDrawer">
                            <v-icon class="fa fa-bars primary--text" />
                        </v-btn>
                    </v-layout>
                </v-flex>
                <v-spacer />
                <v-flex xs9 sm7 md6> <search-details /> </v-flex>
            </v-layout>
            <template v-if="showSearchMobile" #extension>
                <v-layout row justify-center align-center>
                    <v-flex xs11> <search-details /> </v-flex>
                    <v-flex xs1>
                        <v-btn icon @click="showSearchMobile = false">
                            <v-icon class="fas fa-times white--text" />
                        </v-btn>
                    </v-flex>
                </v-layout>
            </template>
        </v-toolbar>
    </div>
</template>

<script lang="ts">
import SearchDetails from '@app/modules/search/handlers/SearchDetails.vue'
import { NavMenuEntry } from '@app/core/components/props'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
    components: {
        SearchDetails
    }
})
export default class TheNavigationDrawer extends Vue {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    supportEmail = 'support@ethvm.com'
    drawer: boolean = false
    active = 0
    sublink = null
    mini: boolean = false
    showSearchMobile: boolean = false

    /*
  ===================================================================================
    LifeCycle
  ===================================================================================
  */

    created() {
        if (!this.showMobile) {
            this.drawer = true
        }
    }

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    get showMobile(): boolean {
        return this.$vuetify.breakpoint.name === 'md' || this.$vuetify.breakpoint.name === 'sm' || this.$vuetify.breakpoint.name === 'xs'
    }

    get headerColor(): string {
        return this.showMobile ? 'primary' : 'white'
    }

    get items(): NavMenuEntry[] {
        return [
            {
                header: {
                    icon: 'fa fa-home',
                    text: this.$i18n.t('home'),
                    routerLink: '/'
                }
            },
            {
                header: {
                    icon: 'fa fa-cubes',
                    text: this.$i18n.tc('block.name', 2),
                    routerLink: '/blocks'
                }
                // links: [
                //     {
                //         text: this.$i18n.t('btn.view-all'),
                //         routerLink: '/blocks',
                //         name: 'blocks'
                //     },
                //     {
                //         text: this.$i18n.tc('uncle.name', 2),
                //         routerLink: '/uncles',
                //         name: 'uncles'
                //     }
                // ]
            },
            {
                header: {
                    text: this.$i18n.tc('tx.name', 2),
                    icon: 'fas fa-exchange-alt',
                    routerLink: '/txs'
                },
                links: [
                    {
                        text: this.$i18n.t('tx.mined-tx'),
                        routerLink: '/txs',
                        name: 'transactions'
                    },
                    {
                        text: this.$i18n.tc('tx.pending', 2),
                        routerLink: '/pending-txs',
                        name: 'pending'
                    }
                ]
            },
            {
                header: {
                    text: this.$i18n.tc('token.name', 2),
                    icon: 'fab fa-ethereum',
                    routerLink: '/tokens'
                },
                links: [
                    {
                        text: this.$i18n.t('token.view-all'),
                        routerLink: '/tokens',
                        name: 'tokens'
                    },
                    {
                        text: this.$i18n.tc('token.favorite', 2),
                        routerLink: '/tokens/favorites',
                        name: 'fav_tokens'
                    }
                ]
            },
            {
                header: {
                    icon: 'fas fa-chart-pie',
                    text: this.$i18n.t('charts.name'),
                    routerLink: '/charts'
                }
            },
            {
                header: {
                    icon: 'fas fa-heart',
                    text: this.$t('fav.title'),
                    routerLink: '/fav_addresses'
                }
            }
        ]
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Sets drawer based on vuetify breakpoints
     *
     */
    setDrawer(): void {
        if (!this.showMobile) {
            this.drawer = true
            this.mini = !this.mini
        } else {
            this.mini = false
            this.drawer = !this.drawer
        }
    }

    /**
     * Fetches the current route path
     * @returns {String} route name
     */

    getCurrentPath(): string {
        return this.$route.name ? this.$route.name : ''
    }
    /**
     * Checks whether passed name matches current path
     * @param name {String}
     * @returns {Boolean}
     */
    isCurrentLinkPath(name: string): boolean {
        return this.getCurrentPath() == name
    }

    /**
     * Checks if any links is the current path
     * @param links any
     * @returns {Boolean}
     */
    checkLinkPath(links: any[] = []): boolean {
        for (const link of links) {
            if (this.isCurrentLinkPath(link.name)) {
                return true
            }
        }
        return false
    }
    @Watch('showMobile')
    onShowMobileChange(newVal: boolean): void {
        if (newVal === false) {
            this.showSearchMobile = false
        }
    }
}
</script>
