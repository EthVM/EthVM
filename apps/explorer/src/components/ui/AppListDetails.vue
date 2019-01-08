<template>
  <v-card color="white" flat class="pt-3">
    <slot name="details-title"></slot>
    <v-divider class="lineGrey"></v-divider>
    <v-list>
      <v-list-tile
        v-for="(item, index) in items"
        :key="index"
        :class="[index % 2 == 0 ? 'background: white' : 'background: tableGrey']"
      >
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
            <v-list-tile-action v-if="item.copy">
              <app-copy-to-clip :valueToCopy="item.detail"></app-copy-to-clip>
            </v-list-tile-action>
          </v-flex>
        </v-layout>
      </v-list-tile>
      <v-slide-y-transition group>
        <v-list-tile
          v-if="more"
          v-for="(item, count) in moreItems"
          :key="count"
          :class="[count % 2 == 0 ? 'background: white' : 'background: tableGrey']"
        >
          <v-layout align-center justify-start row fill-height class="pa-3">
            <v-flex xs4 sm3 md2>
              <v-list-tile-title class="info--text font-weight-medium">{{ item.title }}</v-list-tile-title>
            </v-flex>
            <v-flex xs7 sm8 md9>
              <v-list-tile-title v-if="!item.link" class="text-muted text-truncate">
                {{ item.detail }}
                <timeago
                  v-if="item.title == $t('common.timestmp')"
                  :datetime="block.getTimestamp()"
                  :auto-update="10"
                ></timeago>
              </v-list-tile-title>
              <router-link v-else :to="item.link">
                <v-list-tile-title class="text-truncate">{{ item.detail }}</v-list-tile-title>
              </router-link>
            </v-flex>
            <v-flex xs1>
              <v-list-tile-action v-if="item.copy">
                <app-copy-to-clip :valueToCopy="item.detail"></app-copy-to-clip>
              </v-list-tile-action>
            </v-flex>
          </v-layout>
        </v-list-tile>
      </v-slide-y-transition>
    </v-list>
    <v-btn v-if="!more" v-on:click="setView()" flat block class="secondary">
      <v-icon class="fa fa-angle-down white--text"></v-icon>
    </v-btn>
    <v-btn v-else v-on:click="setView()" flat block class="secondary">
      <v-icon class="fa fa-angle-up white--text"></v-icon>
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import AppCopyToClip from '@app/components/ui/AppCopyToClip.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppCopyToClip
  }
})
export default class AppListDetails extends Vue {
  @Prop(Array) items!: Array
  @Prop(Array) moreItems!: Array

  data() {
    return {
      showMore: false,
      dialog: false
    }
  }
  //Methods:
  setView() {
    this.showMore = !this.showMore
  }

  //Computed:
  get more() {
    return this.showMore
  }
}
</script>

