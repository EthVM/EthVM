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
      <token-table-transfers
        :transfers="tokenTransfers"
        :total-transfers="totalTransfers"
        :loading="isTokenTransfersLoading"
        :error="errorTokenTransfers"
        :page="transfersPage"
        :decimals="decimals"
        @page="setPageTransfers"
      />
    </v-tab-item>
    <!--
    =====================================================================================
      HOLDERS
    =====================================================================================
    -->
    <v-tab-item slot="tabs-item" value="tab-1">
      <v-progress-linear color="blue" indeterminate v-if="isTokenHoldersLoading" class="mt-0" />
      <token-table-holders
        :holders="tokenHolders"
        :page="holdersPage"
        :total-holders="totalHolders"
        :address-ref="addressRef"
        :total-supply="totalSupply"
        :decimals="decimals"
        :loading="isTokenHoldersLoading"
        :error="errorTokenHolders"
        @page="setPageHolders"
      />
    </v-tab-item>
  </app-tabs>
</template>

<script lang="ts">
  import AppTabs from '@app/core/components/ui/AppTabs.vue'
  import AppError from '@app/core/components/ui/AppError.vue'
  import TokenTableTransfers from '@app/modules/tokens/components/TokenTableTransfers.vue'
  import TokenTableHolders from '@app/modules/tokens/components/TokenTableHolders.vue'
  import { Transfer } from '@app/core/models'
  import { Tab } from '@app/core/components/props'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import BigNumber from 'bignumber.js'

  @Component({
  components: {
    AppError,
    AppTabs,
    TokenTableHolders,
    TokenTableTransfers
  }
})
export default class TokenDetailsTabs extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) addressRef!: string
  @Prop(Array) tokenTransfers!: Transfer[]
  @Prop(String) totalTransfers!: string
  @Prop(Number) transfersPage!: number
  @Prop(Array) tokenHolders!: any
  @Prop(Number) totalHolders!: number
  @Prop(Number) holdersPage!: number
  @Prop(BigNumber) totalSupply?: BigNumber
  @Prop(Boolean) isTokenTransfersLoading!: boolean
  @Prop(Boolean) isTokenHoldersLoading!: boolean
  @Prop(String) errorTokenTransfers!: string
  @Prop(String) errorTokenHolders!: string
  @Prop(String) decimals?: string

  /*
   ===================================================================================
     Methods
   ===================================================================================
   */

  setPageTransfers(page: number): void {
    this.$emit('transfersPage', page)
  }

  setPageHolders(page: number): void {
    this.$emit('holdersPage', page)
  }

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
