<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-info-load v-if="loading && !hasError" />
    <app-error :has-error="hasError" :message="error" />
    <!--
    =====================================================================================
      ADDRESS DETAILS

      This section shows all of the data loaded from "load-basic-info"
      It will load as soon as that particular information has been retrieved.
    =====================================================================================
    -->
    <v-layout v-if="!loading && !hasError" row wrap justify-start class="mb-4">
      <v-flex xs12>
        <address-detail :account="account" :type-addrs="detailsType" :address="addressRef" />
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
        <table-txs :address="addressRef" :page-type="'address'" :max-items="max"></table-txs>
      </v-tab-item>
      <!--
      =====================================================================================
        TOKENS TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" value="tab-1">
        <table-address-tokens :loading="tokensLoading" :tokens="account.tokens" :holder="account.address" :error="tokensError" />
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
      <v-tab-item slot="tabs-item" value="tab-5">
        <table-transfers :address="addressRef" :page-type="'internal'" />
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
      <v-tab-item slot="tabs-item" v-if="account.isCreator" value="tab-4">
        <table-address-contracts :address="addressRef" />
      </v-tab-item>
    </app-tabs>
  </v-container>
</template>

<script lang="ts">
import { EthValue, PendingTx } from '@app/core/models'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AddressDetail from '@app/modules/addresses/components/AddressDetail.vue'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import TableAddressTokens from '@app/modules/addresses/components/TableAddressTokens.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { eth, TinySM } from '@app/core/helper'
import { AccountInfo } from '@app/modules/addresses/props'
import { Crumb, Tab } from '@app/core/components/props'
import TableAddressContracts from '@app/modules/addresses/components/TableAddressContracts.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableTransfers from '@app/modules/transfers/components/TableTransfers.vue';

const MAX_ITEMS = 10

const ADDRESS_DETAIL_TYPE = 'address'
const CONTRACT_DETAIL_TYPE = 'contract'

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
    TableTxs,
    TableTransfers
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
  loading = true
  validHash = true
  account = new AccountInfo(this.addressRef)

  /* Pending Txs: */
  pendingTxsLoading = true
  pendingTxsError = ''

  /* Tokens: */
  tokensLoading = true
  tokensError = ''

  // State Machine
  sm!: TinySM

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted(): void {
    const ref = this.addressRef

    // 1. Create State Machine
    this.sm = new TinySM([
      {
        name: 'initial',
        enter: () => {
          // 1. Check that current block ref is a valid one
          if (!eth.isValidAddress(ref)) {
            this.sm.transition('error')
            return
          }
          // 2. If everything goes well, we proceed to load basic information
          this.sm.transition('load-basic-info')
        }
      },
      {
        name: 'load-basic-info',
        enter: () => {
          const account = this.$api.getAccount(this.addressRef)
          const contract = this.$api.getContract(this.addressRef)
          const exchangeRate = this.$api.getExchangeRateQuote('ethereum_usd')

          // If one promise fails, we still continue processing every entry (and for those failed we receive undefined)
          const promises = [account, contract, exchangeRate].map(p => p.catch(() => undefined))

          Promise.all(promises)
            .then((res: any[]) => {
              const account = res[0] || {}
              this.account.isCreator = account.isContractCreator || false
              this.account.isMiner = account.isMiner || false
              this.account.totalTxs = account.totalTxCount || 0
              this.account.fromTxCount = account.outTxCount || 0
              this.account.toTxCount = account.inTxCount || 0
              this.account.balance = new EthValue(account.balance || 0)

              this.account.type = res[1] ? CONTRACT_DETAIL_TYPE : ADDRESS_DETAIL_TYPE
              this.account.exchangeRate.USD = res[2] ? res[2].price : 0

              this.error = ''
              this.loading = false

              this.sm.transition('load-token-complementary-info')
            })
            .catch(err => this.sm.transition('error'))
        }
      },
      {
        name: 'load-token-complementary-info',
        enter: () => {
          const totalTokensOwned = this.$api.getAddressAllTokensOwned(this.addressRef)

          const promises = [totalTokensOwned].map(p => p.catch(() => undefined))

          Promise.all(promises)
            .then((res: any[]) => {
              this.account.tokens = res[0] || []
              this.account.tokensOwned = this.account.tokens.length
              this.tokensLoading = false
            })
            .catch(err => this.sm.transition('error'))
        }
      },
      {
        name: 'success',
        enter: () => {
          // 1. Disable global error
          this.error = ''

          // 2. Disable global loading
          this.loading = false
        }
      },
      {
        name: 'error',
        enter: () => {
          // 1. Set global error to error
          this.error = this.$i18n.t('message.invalid.addr').toString()

          // 2. Disable global loading
          this.loading = false
        }
      }
    ])

    // 2. Kickstart State Machine
    this.sm.transition('initial')
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  fetchPendingTxs(page = 0, limit = MAX_ITEMS, filter = 'all'): Promise<PendingTx[]> {
    return this.$api.getPendingTxsOfAddress(this.addressRef, filter, limit, page)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get hasError(): boolean {
    return this.error !== ''
  }

  get hasPendingTxsError(): boolean {
    return this.pendingTxsError !== ''
  }

  get hasTokensError(): boolean {
    return this.tokensError !== ''
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
      },
      // {
      //   id: 2,
      //   title: this.$i18n.tc('tx.pending', 2),
      //   isActive: false
      // },
      {
        id: 5,
        title: this.$i18n.tc('transfer.internal', 2),
        isActive: false
      }
    ]

    if (!this.loading && !this.error) {
      if (this.account.isMiner) {
        const newTab = {
          id: 3,
          title: this.$i18n.t('miner.history').toString(),
          isActive: false
        }
        tabs.push(newTab)
      }

      if (this.account.isCreator) {
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
