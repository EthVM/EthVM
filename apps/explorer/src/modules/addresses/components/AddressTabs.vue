<template>
   <app-tabs :tabs="tabs">
    <!--
    =====================================================================================
      TRANSACTIONS
    =====================================================================================
    -->
    <v-tab-item slot="tabs-item" value="tab-0">
      <v-progress-linear color="blue" indeterminate v-if="isTxsLoading" class="mt-0" />
      <table-address-txs
        v-if="!isTxsLoading"
        :loading="isTxsLoading"
        :address="account.address"
        :txs="account.txs"
        :total-txs="totalFilter"
        @filter="setFilterTxs"
      />
    </v-tab-item>
    <!--
    =====================================================================================
      TOKENS
    =====================================================================================
    -->
    <!-- End Transactions -->
    <!-- Tokens -->
    <!-- <v-tab-item slot="tabs-item" value="tab-1">
      <table-address-tokens v-if="!tokensError" :loading="tokensLoading" :tokens="account.tokens" :error="tokensError" />
      <app-error :server-error="tokensError" v-else />
    </v-tab-item> -->
    <!-- End Tokens -->
    <!-- Pending Transactions -->
    <!-- <v-tab-item slot="tabs-item" value="tab-2">
      <table-address-txs v-if="!pendingTxsError" :loading="pendingTxsLoading" :address="account.address" :txs="account.pendingTxs" :is-pending="true" />
      <app-error :server-error="pendingTxsError" v-else />
    </v-tab-item> -->
    <!-- End Pending Transactions -->
    <!-- Mined Blocks -->
    <!-- <v-tab-item slot="tabs-item" v-if="account.isMiner" value="tab-3">
      <table-blocks
        v-if="!minerBlocksError"
        :loading="minerBlocksLoading"
        :blocks="account.minedBlocks"
        :page-type="detailsType"
        :total-blocks="minedTotal"
        :max-items="max"
        @getBlockPage="setMinedPage"
      />
      <app-error :server-error="minerBlocksError" v-else />
    </v-tab-item> -->
  </app-tabs>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TableAddressTxs from '@app/modules/addresses/components/TableAddressTxs.vue'
import { Tx } from '@app/core/models'
import { AccountInfo } from '@app/modules/addresses/props'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppTabs,
    TableAddressTxs
  }
})
export default class AddressTabs extends Vue {
  @Prop(Object) account: AccountInfo
  @Prop(String) txsFilter: string
  @Prop(Boolean) isAccountLoading: boolean
  @Prop(Boolean) isTxsLoading: boolean
  @Prop(String) errorTxs: string

  txsFilter = 'all'

  setFilterTxs(filter: string, page: number) {
    console.log('AddressTabs', filter, page)
    this.$emit('setFilterTxs', filter, page)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get totalFilter(): number {
    switch (this.txsFilter) {
      case 'all':
        return this.account.totalTxs
      case 'in':
        return this.account.toTxCount
      case 'out':
        return this.account.fromTxCount
    }
  }

  /**
   * Props object to describe tabs for AppTabs component
   */
  get tabs() {
    const tabs = [
      {
        id: '0',
        title: this.$i18n.t('tabs.txH'),
        isActive: true
      },
      {
        id: '1',
        title: this.$i18n.t('tabs.tokens'),
        isActive: false
      },
      {
        id: '2',
        title: this.$i18n.t('tabs.pending'),
        isActive: false
      }
    ]

    if (!this.isAccountLoading && !this.error) {
      if (this.account.isMiner) {
        const newTab = {
          id: '3',
          title: this.$i18n.t('tabs.miningH'),
          isActive: false
        }
        tabs.push(newTab)
      }

      if (this.account.isCreator) {
        const newTab = {
          id: '4',
          title: this.$i18n.t('tabs.contracts'),
          isActive: false
        }
        tabs.push(newTab)
      }
    }

    return tabs
  }
}
</script>
