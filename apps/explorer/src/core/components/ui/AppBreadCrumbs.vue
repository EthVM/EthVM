<template>
  <v-card flat color="transparent" class="mb-4">
    <v-layout row wrap align-center justify-start class="pl-2 pr-2 mb-4">
      <v-card-title v-for="(item, i) in crumbs" :key="i" class="pl-0 pr-1 pb-0 text-truncate">
        <v-icon small v-if="item.icon" :class="[item.disabled ? 'black--text  pr-2' : 'info--text  pr-2']">{{ item.icon }}</v-icon>
        <p v-if="item.link" class="pa-0 ma-0 text-truncate">
          <router-link v-if="!item.plural" :class="[item.disabled ? 'black--text' : 'info--text']" :to="item.link">{{ $t(item.text) }}</router-link>
          <router-link v-else :class="[item.disabled ? 'black--text' : 'info--text']" :to="item.link">{{ $tc(item.text, item.plural) }}</router-link>
        </p>
        <div v-else>
          <div v-if="!item.label">
            <p v-if="!item.plural" class="black--text pa-0 ma-0 text-truncate">{{ $t(item.text) }}</p>
            <p v-else class="black--text pa-0 ma-0 text-truncate">{{ $tc(item.text, item.plural) }}</p>
          </div>
          <div v-else>
            <p v-if="!item.plural" class="black--text pa-0 ma-0 text-truncate">{{ $t(item.text) }}{{ item.label }}</p>
            <p v-else class="black--text pa-0 ma-0 text-truncate">{{ $tc(item.text, item.plural) }}{{ item.label }}</p>
          </div>
        </div>
        <p v-if="i < crumbs.length - 1" class="pl-1 pr-0 pt-0 mb-0 caption">/</p>
      </v-card-title>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Crumb } from '@app/core/components/props'

@Component
export default class AppBreadCrumbs extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Array) newItems!: Crumb[]

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  crumbs: Crumb[] = []

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.prepareBreadcrumbs()
  }

  /*
  ===================================================================================
    Watch
  ===================================================================================
  */

  @Watch('newItems')
  onNewItemsChange() {
    this.crumbs = []
    this.prepareBreadcrumbs()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  prepareBreadcrumbs(): void {
    this.setHome()
    this.addNewItems()
  }

  setHome(): void {
    this.crumbs.push(this.home)
  }

  addNewItems(): void {
    if (this.newItems) {
      this.crumbs[0].disabled = false
      for (const i in this.newItems) {
        this.crumbs.push(this.newItems[i])
      }
    }
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get home(): Crumb {
    return {
      text: 'home',
      disabled: true,
      icon: 'fa fa-home',
      link: '/'
    }
  }
}
</script>
