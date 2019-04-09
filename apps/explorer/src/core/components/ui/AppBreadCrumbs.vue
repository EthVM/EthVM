<template>
  <v-card flat color="transparent" class="mt-2 mb-4">
    <v-layout row wrap align-center justify-start pa-2>
      <v-card-title v-for="(item, i) in crumbs" :key="i" class="crumb-container">
        <v-icon small v-if="item.icon" :class="[item.disabled ? 'black--text  pr-2' : 'info--text  pr-2']">{{ item.icon }}</v-icon>
        <p v-if="item.link">
          <router-link :class="[item.disabled ? 'black--text' : 'info--text']" :to="item.link">{{ getText(item) }}</router-link>
        </p>
        <div v-else>
          <p class="black--text">{{ getText(item) }}</p>
        </div>
        <div v-if="item.label">
          <p v-if="!item.label.hash">: {{ item.label.name }}</p>
          <p v-else>: {{ getHash(item.label.name) }}</p>
        </div>
        <p v-if="i < crumbs.length - 1" class="pl-1 pr-0 caption">/</p>
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

  getText(item: Crumb) {
    return item.plural ? this.$tc(item.text, item.plural) : this.$t(item.text)
  }

  getHash(hash: string): string {
    const n = hash.length
    return `${hash.slice(0, 4)}...${hash.slice(n - 4, n)}`
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

<style scoped lang="css">



.crumb-container{
  min-width: fit-content;
  padding: 0px 0px;
  margin-right: 0.5em;
}

p {
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
