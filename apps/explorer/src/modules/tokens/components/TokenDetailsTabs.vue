<template>
  <app-tabs :tabs="tabs">
    <!--
    =====================================================================================
      TRANSFERS
    =====================================================================================
    -->
    <v-tab-item slot="tabs-item" value="tab-0">
      <table-transfers :address="addressRef" :pageType="'token'" :decimals="decimals" />
    </v-tab-item>
    <!--
    =====================================================================================
      HOLDERS
    =====================================================================================
    -->
    <v-tab-item slot="tabs-item" value="tab-1">
      <token-table-holders :address-ref="addressRef" :total-supply="totalSupply" :decimals="decimals" />
    </v-tab-item>
  </app-tabs>
</template>

<script lang="ts">
  import AppTabs from '@app/core/components/ui/AppTabs.vue'
  import AppError from '@app/core/components/ui/AppError.vue'
  import TokenTableHolders from '@app/modules/tokens/components/TokenTableHolders.vue'
  import { Transfer } from '@app/core/models'
  import { Tab } from '@app/core/components/props'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import BigNumber from 'bignumber.js'
  import TableTransfers from '@app/modules/transfers/components/TableTransfers.vue';

  @Component({
  components: {
    AppError,
    AppTabs,
    TokenTableHolders,
    TableTransfers
  }
})
export default class TokenDetailsTabs extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) addressRef!: string
  @Prop(BigNumber) totalSupply?: BigNumber
  @Prop(Number) decimals?: number

  /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

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
