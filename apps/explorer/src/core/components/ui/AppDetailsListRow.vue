<template>
  <v-layout align-center justify-start row fill-height class="pa-3">
    <!-- Detail Title -->
    <v-flex xs4 sm3 md2>
      <div class="info--text font-weight-medium" v-html="detail.title" />
    </v-flex>
    <!-- End Detail Title -->
    <!-- Detail Info -->
    <v-flex xs7 sm8 md9>
      <div v-if="isLoading">
        <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
      </div>
      <div v-else>
        <div v-if="!detail.link" class="text-muted text-truncate" v-html="detail.detail"></div>
        <router-link v-else :to="detail.link">
          <div class="text-truncate" v-html="detail.detail"></div>
        </router-link>
      </div>
    </v-flex>
    <v-flex xs1>
      <v-list-tile-action v-if="detail.copy"> <app-copy-to-clip :value-to-copy="detail.detail" /> </v-list-tile-action>
    </v-flex>
    <!-- End Detail Info -->
  </v-layout>
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
export default class AppDetailsListRow extends Vue {
  @Prop(Object) detail: Detail
  @Prop(Boolean) isLoading: boolean
}
</script>
