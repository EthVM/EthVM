<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />

    <div v-if="!loading && !error">
      <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12>
          <address-detail :account="account" :type-addrs="detailsType" />
        </v-flex>
      </v-layout>

      <app-tabs :tabs="tabs">
        <!-- Transactions -->
        <v-tab-item slot="tabs-item" value="tab-0">
          <table-address-txs
            v-if="!txsError"
            :loading="txsLoading"
            :address="account.address"
            :txs="account.txs"
            :total-txs="totalFilter"
            @filter="setFilterTxs"
          />
          <app-error :server-error="txsError" v-else />
        </v-tab-item>
        <!-- End Transactions -->
        <!-- Tokens -->
        <v-tab-item slot="tabs-item" value="tab-1">
          <table-address-tokens v-if="!tokensError" :loading="tokensLoading" :tokens="account.tokens" :error="tokensError" />
          <app-error :server-error="tokensError" v-else />
        </v-tab-item>
        <!-- End Tokens -->
        <!-- Pending Transactions -->
        <v-tab-item slot="tabs-item" value="tab-2">
          <table-address-txs v-if="!pendingTxsError" :loading="pendingTxsLoading" :address="account.address" :txs="account.pendingTxs" :is-pending="true" />
          <app-error :server-error="pendingTxsError" v-else />
        </v-tab-item>
        <!-- End Pending Transactions -->
        <!-- Mined Blocks -->
        <v-tab-item slot="tabs-item" v-if="account.isMiner" value="tab-3">
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
        </v-tab-item>
        <!-- End Mined Blocks -->
        <!-- Contract Creator (no need to implement yet) -->
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
    </div>
    <app-info-load v-else-if="loading && !error" />
    <app-error v-else :reference="addressRef" page-type="address" />
  </v-container>
</template>

<script lang="ts">
import { Block, EthValue, Tx, PendingTx } from '@app/core/models'
import { Events, Contract } from 'ethvm-common'
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
import { resolve } from 'path'

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
    TableAddressTxs,
    TableBlocks,
    TableAddressTokens
  }
})
export default class PageDetailsAddress extends Vue {
  @Prop({ type: String, default: '' }) addressRef!: string

  detailsType = 'address'
  error = false
  loading = true
  validHash = true
  account: AccountInfo = null

  /*Transactions: */
  txsLoading = true
  txsError = false
  txsPage = 0
  txsFilter = 'all'

  /* Pending Txs: */
  pendingTxsLoading = true
  pendingTxsError = false

  /* Tokens: */
  tokensLoading = true
  tokensError = false

  /* Miner Blocks: */
  minerBlocksLoading = true
  minerBlocksError = false
  minedPage = 0
  minedTotal = 20

  /* Contracts: */
  contractsLoading = true
  contractsError = false

  // State Machine (not needed to be reactive, this is why we use undefined instead of null)
  sm: TinySM = undefined

  mounted() {
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

          // 2. Build AccountInfo model with current address
          this.account = new AccountInfo(this.addressRef)

          // 3. If everything goes well, we proceed to load basic information
          this.sm.transition('load-basic-info')
        }
      },
      {
        name: 'load-basic-info',
        enter: () => {
          const addressMetadata = this.$api.getAddressMetadata(this.addressRef)
          const addressBalance = this.$api.getAddressBalance(this.addressRef)
          const contract = this.$api.getContract(this.addressRef)
          const exchangeRate = this.$api.getExchangeRateQuote('ETH', 'USD')

          // If one promise fails, we still continue processing every entry (and for those failed we receive undefined)
          const promises = [addressMetadata, addressBalance, contract, exchangeRate].map(p => p.catch(() => undefined))

          Promise.all(promises)
            .then((res: any[]) => {
              const metadata = res[0] || {}
              this.account.isCreator = metadata.isContractCreator || false
              this.account.isMiner = metadata.isMiner || false
              this.account.totalTxs = metadata.totalTxCount || 0
              this.account.toTxCount = metadata.toTxCount || 0
              this.account.fromTxCount = metadata.fromTxCount || 0
              this.account.balance = res[1] ? new EthValue(res[1].amount) : new EthValue(0)
              this.account.type = res[2] ? CONTRACT_DETAIL_TYPE : ADDRESS_DETAIL_TYPE
              this.account.exchangeRate.USD = res[3].price

              this.error = false
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
          const addressPendingTxs = this.fetchPendingTxs()
          const minedBlocks = this.account.isMiner ? this.fetchMinedBlocks() : Promise.resolve([])
          const contractsCreated = this.account.isCreator ? this.fetchContractsCreated() : Promise.resolve([])

          // If one promise fails, we still continue processing every entry (and for those failed we receive undefined)
          const promises = [addressTxs, addressPendingTxs, minedBlocks, contractsCreated].map(p => p.catch(() => undefined))

          Promise.all(promises)
            .then((res: any[]) => {
              // Txs
              this.account.txs = res[0] || []
              this.txsLoading = false

              // Pending Txs
              this.account.pendingTxs = res[1] || []
              this.pendingTxsLoading = false

              // Mined Blocks
              this.account.minedBlocks = res[2] || []
              this.minerBlocksLoading = false

              // Contract Creator
              this.account.contracts = res[3] || []

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
          this.error = false

          // 2. Disable global loading
          this.loading = false
        }
      },
      {
        name: 'error',
        enter: () => {
          // 1. Set global error to error
          this.error = true

          // 2. Disable global loading
          this.loading = false
        }
      }
    ])

    // 2. Kickstart State Machine
    this.sm.transition('initial')
  }

  // Method:
  fetchTxs(page = this.txsPage, limit = MAX_ITEMS, filter = this.txsFilter): Promise<Tx[]> {
    return this.$api.getTxsOfAddress(this.addressRef, filter, limit, page)
  }

  fetchPendingTxs(page = 0, limit = MAX_ITEMS, filter = 'all'): Promise<PendingTx[]> {
    return this.$api.getPendingTxsOfAddress(this.addressRef, filter, limit, page)
  }

  fetchMinedBlocks(page = this.minedPage, limit = MAX_ITEMS): Promise<Block[]> {
    return this.$api.getBlocksMinedOfAddress(this.addressRef, limit, page)
  }

  fetchContractsCreated(page = 0, limit = MAX_ITEMS): Promise<Contract[]> {
    return this.$api.getContractsCreatedBy(this.addressRef, limit, page)
  }

  setFilterTxs(_filter: string, _page: number): void {
    this.txsFilter = _filter
    this.txsPage = _page
    this.txsLoading = true
  }

  setMinedPage(_page: number): void {
    this.minedPage = _page
    this.minerBlocksLoading = true
  }

  updateTxs(): void {
    this.fetchTxs().then(
      res => {
        this.account.txs = res
        this.txsLoading = false
      },
      err => {
        this.txsError = true
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
        this.minerBlocksError = true
      }
    )
  }

  //Watch
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

  // Computed
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
    }
  }

  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.address'),
        disabled: true
      }
    ]
  }

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

    if (!this.loading && !this.error) {
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
