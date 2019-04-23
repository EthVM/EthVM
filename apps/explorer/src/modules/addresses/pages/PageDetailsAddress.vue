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
        <address-detail :account="account" :type-addrs="detailsType" />
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
        <table-address-txs
          :loading="txsLoading"
          :address="account.address"
          :txs="account.txs"
          :total-txs="totalFilter"
          :error="txsError"
          :page="txsPage"
          @filter="setFilterTxs"
        />
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
        <token-table-transfers
          :transfers="account.internalTransfers"
          :total-transfers="account.totalInternalTransfers"
          :loading="transfersLoading"
          :error="hasTransfersError"
          :page="transfersPage"
          :show-type="true"
          @page="setPageTransfers"
        />
      </v-tab-item>
      <!--
      =====================================================================================
        MINED BLOCKS TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" v-if="account.isMiner" value="tab-3">
        <table-blocks
          :loading="minerBlocksLoading"
          :blocks="account.minedBlocks"
          :page-type="detailsType"
          :total-blocks="account.totalMinedBlocks"
          :max-items="max"
          :page="minedPage"
          :simple-pagination="true"
          :error="minerBlocksError"
          @getBlockPage="setMinedPage"
        />
      </v-tab-item>
      <!--
      =====================================================================================
        CONTRACT CREATOR TAB (not implemented yet)
      =====================================================================================
      -->
      <!-- <v-tab-item v-if="account.conCreator" value="tab-4">
      <v-card>
        <ul>
          <li>Name:</li>
          <li>TWN</li>
          <li>Balance:</li>
          <li>20,930 TWN</li>
          <li>Value:</li>
          <li>$0.00</li>
          <li>ERC 20 Contract:</li>
          <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
        </ul>
      </v-card>
      </v-tab-item>-->
    </app-tabs>
  </v-container>
</template>

<script lang="ts">
import { Block, Contract, EthValue, SimpleTx, PendingTx, SimpleBlock, Transfer } from '@app/core/models'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AddressDetail from '@app/modules/addresses/components/AddressDetail.vue'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TableAddressTxs from '@app/modules/addresses/components/TableAddressTxs.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import TableAddressTokens from '@app/modules/addresses/components/TableAddressTokens.vue'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { eth, TinySM, State } from '@app/core/helper'
import { AccountInfo } from '@app/modules/addresses/props'
import { Crumb, Tab } from '@app/core/components/props'
import TokenTableTransfers from '@app/modules/tokens/components/TokenTableTransfers.vue'

const MAX_ITEMS = 10

const ADDRESS_DETAIL_TYPE = 'address'
const CONTRACT_DETAIL_TYPE = 'contract'

@Component({
  components: {
    TokenTableTransfers,
    AppInfoLoad,
    AppBreadCrumbs,
    AppError,
    AppTabs,
    AddressDetail,
    TableAddressTxs,
    TableBlocks,
    TableAddressTokens
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

  /*Transactions: */
  txsLoading = true
  txsError = ''
  txsPage = 0
  txsFilter = 'all'

  /* Pending Txs: */
  pendingTxsLoading = true
  pendingTxsError = ''

  /* Internal Transfers */
  transfersLoading = true
  transfersError = ''
  transfersPage = 0

  /* Tokens: */
  tokensLoading = true
  tokensError = ''

  /* Miner Blocks: */
  minerBlocksLoading = true
  minerBlocksError = ''
  minedPage = 0

  /* Contracts: */
  contractsLoading = true
  contractsError = ''

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
          const exchangeRate = this.$api.getExchangeRateQuote('ETH', 'USD')

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
              this.account.exchangeRate.USD = res[2] ? res[2].price : 0 // TODO reset when exchange module re-enabled to: res[2].price

              this.error = ''
              this.loading = false

              this.sm.transition('load-complementary-info')
            })
            .catch(err => this.sm.transition('error'))
        }
      },
      {
        name: 'load-complementary-info',
        enter: () => {
          const addressTxs = this.fetchTxs()
          // TODO: Re-enable whenever pending tx calls available
          // const addressPendingTxs = this.fetchPendingTxs()
          const minedBlocks = this.account.isMiner ? this.fetchMinedBlocks() : Promise.resolve([])
          // TODO: Re-enable whenever contract creator functionality is finished
          const contractsCreated = Promise.resolve([]) // this.account.isCreator ? this.fetchContractsCreated() : Promise.resolve([])

          const internalTransfers = this.fetchTransfers()

          // If one promise fails, we still continue processing every entry (and for those failed we receive undefined)
          // const promises = [addressTxs, addressPendingTxs, minedBlocks, contractsCreated].map(p => p.catch(() => undefined))
          const promises = [addressTxs, minedBlocks, contractsCreated, internalTransfers].map(p => p.catch(() => undefined))

          Promise.all(promises)
            .then((res: any[]) => {
              // Txs
              this.account.txs = res[0] || []
              this.txsLoading = false

              // Pending Txs
              // this.account.pendingTxs = res[1] || []
              // this.pendingTxsLoading = false

              // Mined Blocks
              this.account.minedBlocks = res[1] || [] // res[2] || []
              //Get Total mined Blocks by address
              //this.account.totalMinedBlocks =
              this.minerBlocksLoading = false

              // Contract Creator
              this.account.contracts = res[2] || [] // res[3] || []

              // Internal transfers
              const transfersPage = res[3]
              this.account.internalTransfers = transfersPage ? transfersPage.items : []
              this.account.totalInternalTransfers = transfersPage ? transfersPage.totalCount : 0
              this.transfersLoading = false

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

  fetchTxs(page = this.txsPage, limit = MAX_ITEMS, filter = this.txsFilter): Promise<SimpleTx[]> {
    return this.$api.getTxsOfAddress(this.addressRef, filter, limit, page)
  }

  fetchPendingTxs(page = 0, limit = MAX_ITEMS, filter = 'all'): Promise<PendingTx[]> {
    return this.$api.getPendingTxsOfAddress(this.addressRef, filter, limit, page)
  }

  fetchTransfers(page = this.transfersPage, limit = MAX_ITEMS): Promise<{ items: Transfer[]; totalCount: number }> {
    return this.$api.getInternalTransactionsByAddress(this.addressRef, limit, page)
  }

  fetchMinedBlocks(page = this.minedPage, limit = MAX_ITEMS): Promise<SimpleBlock[]> {
    return this.$api.getBlocksMinedOfAddress(this.addressRef, limit, page)
  }

  fetchContractsCreated(page = 0, limit = MAX_ITEMS): Promise<Contract[]> {
    return this.$api.getContractsCreatedBy(this.addressRef, limit, page)
  }

  setFilterTxs(filter: string, page: number): void {
    this.txsFilter = filter
    this.txsPage = page
    this.txsLoading = true
  }

  setMinedPage(page: number): void {
    this.minedPage = page
    this.minerBlocksLoading = true
  }

  setPageTransfers(page: number): void {
    this.transfersPage = page
    this.transfersLoading = true
  }

  updateTxs(): void {
    this.fetchTxs().then(
      res => {
        this.account.txs = res
        this.txsLoading = false
      },
      err => {
        this.txsError = this.$i18n.t('message.invalid.addr').toString()
      }
    )
  }

  updateMined(): void {
    this.fetchMinedBlocks().then(
      res => {
        this.account.minedBlocks = res
        this.minerBlocksLoading = false
      },
      err => {
        this.minerBlocksError = this.$i18n.t('message.no-data').toString()
      }
    )
  }

  updateTransfers(): void {
    this.fetchTransfers().then(
      res => {
        this.account.internalTransfers = res.items
        this.account.totalInternalTransfers = res.totalCount
        this.transfersLoading = false
      },
      err => {
        this.transfersError = this.$i18n.t('message.no-data').toString()
      }
    )
  }

  /*
  ===================================================================================
    Watch
  ===================================================================================
  */

  @Watch('txsFilter')
  onTxsFilterChanged(newVal: number, oldVal: number): void {
    if (newVal) {
      this.updateTxs()
    }
  }

  @Watch('txsPage')
  onTxsPageChanged(newVal: number, oldVal: number): void {
    this.updateTxs()
  }

  @Watch('minedPage')
  onMinedPageChanged(newVal: number, oldVal: number): void {
    this.updateMined()
  }

  @Watch('transfersPage')
  onTransfersPageChanges(newVal: number, oldVal: number): void {
    if (newVal) {
      this.updateTransfers()
    }
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get hasError(): boolean {
    return this.error !== ''
  }

  get hasTxsError(): boolean {
    return this.txsError !== ''
  }

  get hasPendingTxsError(): boolean {
    return this.pendingTxsError !== ''
  }

  get hasTransfersError(): boolean {
    return this.transfersError !== ''
  }

  get hasTokensError(): boolean {
    return this.tokensError !== ''
  }

  get hasMinerBlocksError(): boolean {
    return this.minerBlocksError !== ''
  }

  get hasContractsError(): boolean {
    return this.contractsError !== ''
  }

  get max(): number {
    return MAX_ITEMS
  }

  get totalFilter(): number {
    switch (this.txsFilter) {
      case 'all':
        return this.account.totalTxs
      case 'in':
        return this.account.toTxCount
      case 'out':
        return this.account.fromTxCount
      default:
        return 0
    }
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
