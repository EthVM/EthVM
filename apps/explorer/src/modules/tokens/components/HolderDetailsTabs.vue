<template>
  <app-tabs :tabs="tabs">
    <!-- Transfers -->
    <v-tab-item slot="tabs-item" value="tab-0">
      <v-progress-linear color="blue" indeterminate v-if="isHolderTransfersLoading" class="mt-0" />
      <holder-table-transfers v-if="!isHolderTransfersLoading && !hasErrorHolderTransfers" :transfers="holderTransfers" />
    </v-tab-item>
    <!-- End Transfers -->
  </app-tabs>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import HolderTableTransfers from '@app/modules/tokens/components/HolderTableTransfers.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Tab } from '@app/core/components/props'

@Component({
  components: {
    AppTabs,
    HolderTableTransfers
  }
})
export default class HolderDetailsTabs extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) addressRef!: string
  @Prop(Array) holderTransfers!: any
  @Prop(Boolean) isHolderTransfersLoading!: boolean
  @Prop(String) errorHolderTransfers!: string

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasErrorHolderTransfers(): boolean {
    return this.errorHolderTransfers !== ''
  }

  /**
   * Props object to describe tabs for AppTabs component
   */

  get tabs(): Tab[] {
    const tabs = [
      {
        id: '0',
        title: 'Transfers',
        isActive: true
      }
    ]
    return tabs
  }
}
</script>
