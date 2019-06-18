<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-info-load v-if="loading && !hasError" />
    <app-error :has-error="hasError" :message="error" />
    <!--
    =====================================================================================
      ADDRESS DETAILS
    =====================================================================================
    -->
    <v-layout v-if="!loading && !hasError" row wrap justify-start class="mb-4">
      <v-flex xs12>
        <address-detail :account="account" :address="addressRef" />
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      ADDRESS TABS
    =====================================================================================
    -->
    <app-tabs v-if="!loading && !hasError" :tabs="tabs">
      <!--
      =====================================================================================
        TRANSACTIONS TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" value="tab-0">
        <table-address-txs :address="addressRef" :page-type="'address'" :max-items="max"></table-address-txs>
      </v-tab-item>
      <!--
      =====================================================================================
        TOKENS TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" value="tab-1">
        <table-address-tokens :address="addressRef" />
      </v-tab-item>
      <!--
      =====================================================================================
        PENDING TXS TAB
      =====================================================================================
      -->
      <!--      <v-tab-item slot="tabs-item" value="tab-2">-->
      <!--        <table-address-txs :loading="pendingTxsLoading" :address="account.address" :txs="account.pendingTxs" :is-pending="true" :error="pendingTxsError" />-->
      <!--      </v-tab-item>-->
      <!--
      =====================================================================================
        INTERNAL TRANSFERS TAB
      =====================================================================================
      -->
      <v-tab-item v-if="account.hasInternalTransfers" slot="tabs-item" value="tab-5">
        <transfers-table :address="addressRef" :page-type="'internal'" />
      </v-tab-item>
      <!--
      =====================================================================================
        MINED BLOCKS TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" v-if="account.isMiner" value="tab-3">
        <table-blocks :author="addressRef" :page-type="detailsType" :max-items="max" />
      </v-tab-item>
      <!--
      =====================================================================================
        CONTRACT CREATOR TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" v-if="account.isContractCreator" value="tab-4">
        <table-address-contracts :address="addressRef" />
      </v-tab-item>
    </app-tabs>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AddressDetail from '@app/modules/addresses/components/AddressDetail.vue'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import TableAddressTokens from '@app/modules/addresses/components/TableAddressTokens.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Crumb, Tab } from '@app/core/components/props'
import TableAddressContracts from '@app/modules/addresses/components/TableAddressContracts.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import TableAddressTxs from '@app/modules/addresses/components/TableAddressTxs.vue'
import { addressDetail } from '@app/modules/addresses/addresses.graphql'
import { AccountExt } from '@app/core/api/apollo/extensions/account.ext'
import TransfersTable from '@app/modules/transfers/components/TransfersTable.vue'

const MAX_ITEMS = 10

@Component({
  components: {
    AppInfoLoad,
    AppBreadCrumbs,
    AppError,
    AppTabs,
    AddressDetail,
    TableBlocks,
    TableAddressTokens,
    TableAddressContracts,
    TableAddressTxs,
    TransfersTable
  },
  data() {
    return {
      syncing: undefined
    }
  },
  apollo: {
    account: {
      query: addressDetail,

      fetchPolicy: 'cache-and-network',

      variables() {
        const { addressRef } = this
        return { address: addressRef }
      },

      update({ account }) {
        if (account) {
          return new AccountExt(account)
        } else if (!this.syncing) {
          this.error = this.error || this.$i18n.t('message.invalid.addr')
        }
        return null
      },

      error({ graphQLErrors, networkError }) {
        const self = this

        if (graphQLErrors) {
          graphQLErrors.forEach(error => {
            switch (error.message) {
              case 'Currently syncing':
                // TODO handle this better with custom code or something
                self.syncing = true
                break
              default:
              // Do nothing
            }
          })
        }
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      }
    }
  }
})
export default class PageDetailsAddress extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: String, default: '' }) addressRef!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  detailsType = 'address'
  error = ''
  syncing?: boolean
  account?: AccountExt

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get hasError(): boolean {
    return this.error !== ''
  }

  get loading(): boolean | undefined {
    return this.$apollo.loading || this.syncing
  }

  get max(): number {
    return MAX_ITEMS
  }

  get crumbs(): Crumb[] {
    return [
      {
        text: 'address.name',
        disabled: true,
        label: {
          name: `${this.addressRef}`,
          hash: true
        },
        plural: 1
      }
    ]
  }

  get tabs(): Tab[] {
    const tabs: Tab[] = [
      {
        id: 0,
        title: this.$i18n.t('tx.history'),
        isActive: true
      },
      {
        id: 1,
        title: this.$i18n.tc('token.name', 2),
        isActive: false
      }
      // {
      //   id: 2,
      //   title: this.$i18n.tc('tx.pending', 2),
      //   isActive: false
      // }
    ]

    if (!this.loading && !this.error && this.account) {
      if (this.account.hasInternalTransfers) {
        const newTab = {
          id: 5,
          title: this.$i18n.tc('transfer.internal', 2),
          isActive: false
        }
        tabs.push(newTab)
      }

      if (this.account.isMiner) {
        const newTab = {
          id: 3,
          title: this.$i18n.t('miner.history').toString(),
          isActive: false
        }
        tabs.push(newTab)
      }

      if (this.account.isContractCreator) {
        const newTab = {
          id: 4,
          title: this.$i18n.tc('contract.name', 2).toString(),
          isActive: false
        }
        tabs.push(newTab)
      }
    }

    return tabs
  }
}
</script>
