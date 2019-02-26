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


        <v-layout v-if="!detail.link" row align-center justify-start >
          <p class="text-muted text-truncate mb-0 pl-2 pr-1" v-html="detail.detail"></p>
          <p v-if="hasPercentage" :class="priceChangeClass" >({{detail.priceChange}}%)</p>
        </v-layout>

        <router-link v-else :to="detail.link">
          <div class="text-truncate" v-html="detail.detail"></div>
        </router-link>
      </div>
    </v-flex>
    <v-flex xs1>
      <v-list-tile-action v-if="detail.copy">
        <app-copy-to-clip :value-to-copy="detail.detail" /> </v-list-tile-action>
    </v-flex>
    <!-- End Detail Info -->
  </v-layout>
</template>

<script lang="ts">
  import {
    Detail
  } from '@app/core/components/props'
  import {
    Vue,
    Component,
    Prop
  } from 'vue-property-decorator'
  import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'

  @Component({
    components: {
      AppCopyToClip
    }
  })
  export default class AppDetailsListRow extends Vue {
    @Prop(Object) detail: Detail
    @Prop(Boolean) isLoading: boolean

    //Computed:
    get hasPercentage(): boolean {
      return this.detail.priceChange ? true : false
    }

    get priceChangeClass(): string {
      return this.detail.priceChange.includes('+') ? 'txSuccess--text mb-0' : 'txFail--text mb-0'
    }

    //Methods:
    getPercentage(): boolean {
      return this.detail.priceChange.includes('+')
    }
  }
</script>


