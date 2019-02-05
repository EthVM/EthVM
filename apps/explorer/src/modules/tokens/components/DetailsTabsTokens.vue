<template>
  <app-tabs :tabs="tabs">
    <!-- Transfers -->
    <v-tab-item slot="tabs-item" value="tab-0">
      <transfer-table-tokens :transfers="transfers" />
    </v-tab-item>
    <!-- End Transfers -->

    <!-- Holders -->
    <v-tab-item slot="tabs-item" value="tab-1">
      <holder-table-tokens :holders="holders" :address-ref="addressRef" />
    </v-tab-item>
    <!-- End Holders -->
  </app-tabs>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TransferTableTokens from '@app/modules/tokens/components/TransferTableTokens.vue'
import HolderTableTokens from '@app/modules/tokens/components/HolderTableTokens.vue'
import { Tx } from '@app/core/models'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppTabs,
    TransferTableTokens,
    HolderTableTokens
  }
})
export default class TransferListTokens extends Vue {
  @Prop(Array) transfers: Tx[]
  @Prop(Array) holders: Array<any>
  @Prop(String) addressRef: string

  activeTab = 0

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Props object to describe tabs for AppTabs component
   */
  get tabs() {
    const tabs = [
      {
        id: '0',
        title: 'Transfers',
        isActive: true
      },
      {
        id: '1',
        title: 'Holders',
        isActive: false
      }
    ]
    return tabs
  }
}
</script>
