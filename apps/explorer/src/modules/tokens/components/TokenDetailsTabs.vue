<template>
  <app-tabs :tabs="tabs">
    <!--
    =====================================================================================
      TRANSFERS
    =====================================================================================
    -->
    <v-tab-item slot="tabs-item" value="tab-0">
      <v-progress-linear color="blue" indeterminate v-if="isTokenTransfersLoading" class="mt-0" />
      <app-error :has-error="hasErrorTokenTransfers" :message="errorTokenTransfers" />
      <token-table-transfers v-if="!isTokenTransfersLoading && !hasErrorTokenTransfers" :transfers="tokenTransfers" />
    </v-tab-item>
    <!--
    =====================================================================================
      HOLDERS
    =====================================================================================
    -->
    <v-tab-item slot="tabs-item" value="tab-1">
      <v-progress-linear color="blue" indeterminate v-if="isTokenHoldersLoading" class="mt-0" />
      <token-table-holders v-if="!isTokenHoldersLoading" :holders="tokenHolders" :address-ref="addressRef" :total-supply="totalSupply" />
    </v-tab-item>
  </app-tabs>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import TokenTableTransfers from '@app/modules/tokens/components/TokenTableTransfers.vue'
import TokenTableHolders from '@app/modules/tokens/components/TokenTableHolders.vue'
import { Tx } from '@app/core/models'
import { Tab } from '@app/core/components/props'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppTabs,
    AppError,
    TokenTableTransfers,
    TokenTableHolders
  }
})
export default class TokenDetailsTabs extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) addressRef!: string
  @Prop(Array) tokenTransfers!: any
  @Prop(Array) tokenHolders!: any
  @Prop(String) totalSupply?: string
  @Prop(Boolean) isTokenTransfersLoading!: boolean
  @Prop(Boolean) isTokenHoldersLoading!: boolean
  @Prop(String) errorTokenTransfers!: string
  @Prop(String) errorTokenHolders!: string

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
  get hasErrorTokenTransfers(): boolean {
    return this.errorTokenTransfers !== ''
  }

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasErrorTokenHolders(): boolean {
    return this.errorTokenHolders !== ''
  }

  /**
   * Props object to describe tabs for AppTabs component
   */
  get tabs(): Tab[] {
    const tabs = [
      {
        id: 0,
        title: 'Transfers',
        isActive: true
      },
      {
        id: 1,
        title: 'Holders',
        isActive: false
      }
    ]
    return tabs
  }
}
</script>
