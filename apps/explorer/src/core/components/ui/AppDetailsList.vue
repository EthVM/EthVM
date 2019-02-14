<template>
  <v-card color="white" flat>
    <!--
    =====================================================================================

      TITLE

      If isLoading, show placeholder bar, otherwise display title.

    =====================================================================================
    -->
    <div v-if="isLoading">
      <v-card-title class="title font-weight-bold pl-4">
        <div style="width: 300px; height: 20px; background: #e6e6e6; border-radius: 2px;"></div>
      </v-card-title>
    </div>
    <div v-else>
      <v-card-title class="title font-weight-bold pl-4" v-html="title"></v-card-title>
      <v-divider class="lineGrey" />
    </div>
    <!--
    =====================================================================================

      LOADING

      If isLoading, show v-progress-linear bar

    =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="isLoading" />
    <!--
    =====================================================================================

      DETAILS

      Iterate through each details[] item and create list.
      If isLoading, show placeholder bar instead of item detail,
      otherwise display item detail.
      Expects a details object populated with the details.title, regardless of
      other data being populated

    =====================================================================================
    -->
    <v-list-tile v-for="(item, index) in details" :key="index">
      <v-layout align-center justify-start row fill-height class="pa-3">
        <!-- Detail Title -->
        <v-flex xs4 sm3 md2>
          <div class="info--text font-weight-medium" v-html="item.title" />
        </v-flex>
        <!-- Detail Info -->
        <v-flex xs7 sm8 md9>
          <div v-if="isLoading">
            <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
          </div>
          <div v-else>
            <div v-if="!item.link" class="text-muted text-truncate" v-html="item.detail"></div>
            <router-link v-else :to="item.link">
              <div class="text-truncate" v-html="item.detail"></div>
            </router-link>
          </div>
        </v-flex>
        <v-flex xs1>
          <v-list-tile-action v-if="item.copy"> <app-copy-to-clip :value-to-copy="item.detail" /> </v-list-tile-action>
        </v-flex>
      </v-layout>
    </v-list-tile>
  </v-card>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'

@Component({
  components: {
    AppCopyToClip
  }
})
export default class AppDetailsList extends Vue {
  @Prop(String) title: string
  @Prop(Array) details: Detail[]
  @Prop(Boolean) isLoading: boolean
}
</script>
