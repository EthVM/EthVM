<template>
  <div id="nav">
    <v-navigation-drawer v-model="drawer" fixed floating class="primary elevation-3 pt-3" app width="260">
      <v-img :src="require('@/assets/logo-white.png')" height="50px" contain class="ma-4"></v-img>
      <v-list class="pa-0" two-line v-for="(item, index) in items" :key="index" v-model="item.active">
        <v-list-tile v-if="!item.links" class="nav--text" :to="item.header.routerLink" active-class="white--text accent" :prepend-icon="item.header.icon" @click="setActive(index, null)">
          <v-layout row align-center justify-start fill-height>
            <v-list-tile-action>
              <v-icon class="mr-2 ml-3">{{item.header.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{ item.header.text }}</v-list-tile-title>
          </v-layout>
        </v-list-tile>
        <v-list-group v-else :class="[item.isActive ? 'accent white--text' : 'nav--text']">
          <v-list-tile slot="activator">
            <v-layout row align-center justify-start fill-height>
              <v-list-tile-action>
                <v-icon class="mr-2 ml-3">{{item.header.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title >{{ item.header.text }}</v-list-tile-title>
            </v-layout>
          </v-list-tile>
          <v-list-tile v-for="(link, j) in item.links" v-if="link.routerLink" :to="link.routerLink" :key="j" @click="setActive(index, j)">
            <v-list-tile-content>
              <v-list-tile-title :class="[link.isActive ? 'white--text ml-5 pl-2' : 'nav--text ml-5 pl-2']">{{link.text}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="white" app fixed clipped flat height="77px">
      <v-layout align-center row fill-height>
        <v-flex xs1>
          <v-layout row>
            <v-btn icon @click.native="drawer = !drawer">
              <v-icon class="fa fa-bars primary--text"></v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs9 sm7 md6 >
          <block-search></block-search>
        </v-flex>
      </v-layout>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
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
          },
          isActive: false
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
              isActive: false
            },
            {
              text: this.$i18n.t('title.uncles'),
              // routerLink: '/uncles',
              isActive: false
            }
          ],
          isActive: false
        },
        {
          header: {
            text: this.$i18n.t('title.tx'),
            icon: 'fas fa-exchange-alt'
          },
          links: [
            {
              text: this.$i18n.t('title.mined'),
              routerLink: '/transactions',
              isActive: false
            },
            {
              text: this.$i18n.t('title.pending'),
              routerLink: '/pending',
              isActive: false
            }
          ],
          isActive: false
        },
        {
          header: {
            text: this.$i18n.t('title.tokens'),
            icon: 'fab fa-ethereum',
            isActive: false
          },
          links: [
            {
              text: this.$i18n.t('title.tokenCntrc'),
              // routerLink: '/contracts',
              isActive: false
            },
            {
              text: this.$i18n.t('title.tokenPrice20'),
              // routerLink: '/prices',
              isActive: false
            }
          ],
          isActive: false
        },
        {
          header: {
            icon: 'fas fa-chart-pie',
            text: this.$i18n.t('title.charts'),
            routerLink: '/charts'
          },
          isActive: false
        }
      ]
    }
  },
  mounted() {
    let path = '/'
    if (this.$route.params.pageName) {
      path = '/' + this.$route.params.pageName
    }
    let search = true
    let i = 0
    while (i < this.items.length && search) {
      if (this.items[i].header.routerLink == path) {
        this.active = i
        this.items[this.active].isActive = true
        search = false
      }
      if (this.items[i].links) {
        let j = 0
        let links = true
        const routes = this.items[i].links
        while (j < routes.length && links) {
          if (routes[j].routerLink == path) {
            this.active = i
            this.sublink = j
            links = false
            search = false
            this.items[this.active].isActive = true
            this.items[this.active].links[this.sublink].isActive = true
          }
          j++
        }
      }
      i++
    }
  },
  methods: {
    setActive(index, subIndex) {
      this.items[this.active].isActive = false
      this.items[index].isActive = true
      if (this.sublink >= 0) {
        this.items[this.active].links[this.sublink].isActive = false
      }
      if (subIndex >= 0) {
        this.items[index].links[subIndex].isActive = true
        this.sublink = subIndex
      }
      this.active = index
      console.log(this.items)
    }
  }
})
</script>
