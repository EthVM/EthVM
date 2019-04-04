<template>
  <div>
    <v-layout align-start justify-start row class="pa-2 mr-2 ml-2">
      <!--
      =====================================================================================
        DETAIL TITLE
      =====================================================================================
      -->
      <v-flex xs4 sm3 md2>
        <div class="info--text font-weight-medium" v-html="detail.title" />
      </v-flex>
      <!--
      =====================================================================================
        DETAIL INFO
      =====================================================================================
      -->
      <v-flex xs7 sm8 md9 pr-0 v-if="!detail.txInput">
        <div v-if="isLoading">
          <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
        </div>
        <div v-else :class="isMonoFont()">
          <router-link v-if="detail.link" :to="detail.link">
            <div class="text-truncate " v-html="detail.detail"></div>
          </router-link>
          <v-layout v-else row align-center justify-start >
            <p class="text-muted text-truncate mb-0 pl-2 pr-1" v-html="detail.detail"></p>
            <p v-if="hasPercentage" :class="priceChangeClass" >({{detail.priceChange}}%)</p>
          </v-layout>
        </div>
      </v-flex>
      <v-flex xs1 pt-0 pb-0 pl-1 v-if="!detail.txInput">
        <app-copy-to-clip v-if="detail.copy" :value-to-copy="detail.detail" />
      </v-flex>
      <v-flex hidden-xs-only sm9 md10 v-if="detail.txInput">
        <div class="data-input pa-3">
          <p v-for="(item, index) in detail.txInput" :key="index" class="mb-2">{{ item }}</p>
        </div>
      </v-flex>
    </v-layout>
    <v-layout v-if="detail.txInput" align-start justify-start row class="mr-2 ml-2">
      <v-flex xs12 hidden-sm-and-up pt-0>
        <div class="data-input pa-3">
          <p v-for="(item, index) in detail.txInput" :key="index" class="mb-2">{{ item }}</p>
        </div>
      </v-flex>
    </v-layout>
  </div>
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
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) detail!: Detail
  @Prop(Boolean) isLoading!: boolean

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get hasPercentage(): boolean {
    return !!this.detail.priceChange
  }
  get priceChangeClass(): string {
    return (this.detail.priceChange && this.detail.priceChange.includes('+')) ? 'txSuccess--text mb-0' : 'txFail--text mb-0'
  }


  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  isMonoFont(): string {
    return this.detail.mono ? 'font-mono' : ''
  }
}
</script>

<style scoped lang="css">
.data-input {
  border: 1.2px solid #dee5f0;
  border-radius: 5px;
}
</style>
