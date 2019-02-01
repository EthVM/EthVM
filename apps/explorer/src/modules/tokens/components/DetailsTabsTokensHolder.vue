<template>
  <app-tabs :tabs="tabs">

    <!-- Transfers -->
    <v-tab-item slot="tabs-item" value="tab-0">
      <transfer-table-tokens-holder :transfers="transfers" />
    </v-tab-item>
    <!-- End Transfers -->

  </app-tabs>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TransferTableTokensHolder from '@app/modules/tokens/components/TransferTableTokensHolder.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppTabs,
    TransferTableTokensHolder
  }
})
export default class DetailsTabsTokensHolder extends Vue {
  @Prop(Array) transfers: array
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
      }
    ]
    return tabs
  }
}
</script>
