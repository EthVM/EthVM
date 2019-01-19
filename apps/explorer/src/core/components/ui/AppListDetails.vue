<template>
  <v-card color="white" flat class="pt-3">
    <slot name="details-title" />
    <v-divider class="lineGrey" />
    <div v-if="!loading">
      <v-list>
        <v-list-tile v-for="(item, index) in items" :key="index" :class="[index % 2 == 0 ? 'background: white' : 'background: tableGrey']">
          <v-layout align-center justify-start row fill-height class="pa-3">
            <v-flex xs4 sm3 md2>
              <v-list-tile-title class="info--text font-weight-medium">{{ item.title }}</v-list-tile-title>
            </v-flex>
            <v-flex xs7 sm8 md9>
              <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">{{ item.detail }}</v-list-tile-title>
              <router-link v-else :to="item.link">
                <v-list-tile-title class="text-truncate">{{ item.detail }}</v-list-tile-title>
              </router-link>
            </v-flex>
            <v-flex xs1>
              <v-list-tile-action v-if="item.copy"> <app-copy-to-clip :value-to-copy="item.detail"></app-copy-to-clip> </v-list-tile-action>
            </v-flex>
          </v-layout>
        </v-list-tile>
        <v-slide-y-transition group v-if="more">
          <v-list-tile v-for="(item, count) in moreItems" :key="count" :class="[count % 2 == 0 ? 'background: white' : 'background: tableGrey']">
            <v-layout align-center justify-start row fill-height class="pa-3">
              <v-flex xs4 sm3 md2>
                <v-list-tile-title class="info--text font-weight-medium">{{ item.title }}</v-list-tile-title>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">
                  {{ item.detail }} <timeago v-if="item.title == $t('common.timestmp')" :datetime="block.getTimestamp()" :auto-update="10" />
                </v-list-tile-title>
                <router-link v-else :to="item.link">
                  <v-list-tile-title class="text-truncate">{{ item.detail }}</v-list-tile-title>
                </router-link>
              </v-flex>
              <v-flex xs1>
                <v-list-tile-action v-if="item.copy"> <app-copy-to-clip :value-to-copy="item.detail"></app-copy-to-clip> </v-list-tile-action>
              </v-flex>
            </v-layout>
          </v-list-tile>
        </v-slide-y-transition>
      </v-list>
      <v-btn v-if="!more" @click="setView()" flat block class="secondary"> <v-icon class="fa fa-angle-down white--text"></v-icon> </v-btn>
      <v-btn v-else @click="setView()" flat block class="secondary"> <v-icon class="fa fa-angle-up white--text"></v-icon> </v-btn>
    </div>
    <div v-else>
      <app-info-load v-if="loading" />
      <v-layout v-else column align-center justify-center ma-3>
        <v-card-title class="primary--text text-xs-center body-2 pb-4">{{ message }}</v-card-title>
        <v-icon class="fa fa-spinner fa-pulse fa-4x fa-fw primary--text" large />
      </v-layout>
    </div>
  </v-card>
</template>

<script lang="ts">
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import { Detail } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppInfoLoad,
    AppCopyToClip
  }
})
export default class AppListDetails extends Vue {
  @Prop(Array) items!: Detail[]
  @Prop(Array) moreItems!: Detail[]
  @Prop(String) detailsType!: string
  @Prop({ type: Boolean, default: true }) loading!: boolean

  showMore = false
  dialog = false

  //Methods:
  setView() {
    this.showMore = !this.showMore
  }

  //Computed:
  get more() {
    return this.showMore
  }

  get messages() {
    return {
      block: this.$i18n.t('message.notMined'),
      tx: this.$i18n.t('message.noTx')
    }
  }

  get message() {
    return this.messages[this.detailsType]
  }
}
</script>
