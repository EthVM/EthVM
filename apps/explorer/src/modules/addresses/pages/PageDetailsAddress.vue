<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />

    <div v-if="!loading">
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
            :total-txs="account.totalTxs"
            :in-txs="[]"
            :totalin-txs="0"
            :out-txs="[]"
            :total-out-txs="0"
          />
          <app-error-no-data v-else />
        </v-tab-item>
        <!-- End Transactions -->
        <!-- Tokens -->
        <v-tab-item slot="tabs-item" value="tab-1">
          <table-address-tokens v-if="!tokensError" :loading="tokensLoading" :tokens="account.tokens" :error="tokensError" />
          <app-error-no-data v-else />
        </v-tab-item>
        <!-- End Tokens -->
        <!-- Pending Transactions -->
        <v-tab-item slot="tabs-item" value="tab-2">
          <table-address-txs v-if="!pendingTxsError" :loading="pendingTxsLoading" :address="account.address" :txs="account.pendingTxs" :is-pending="true" />
          <app-error-no-data v-else />
        </v-tab-item>
        <!-- End Pending Transactions -->
        <!-- Mined Blocks -->
        <v-tab-item slot="tabs-item" v-if="account.isMiner" value="tab-3">
          <table-blocks v-if="!minerBlocksError" :loading="minerBlocksLoading" :blocks="account.minedBlocks" :page-type="detailsType" />
          <app-error-no-data v-else />
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
    <div v-else>
      <app-info-load v-if="loading" />
      <app-error-no-data v-else-if="error" />
    </div>
  </v-container>
</template>

// TODO: Finish proper implementation of Table-Address-Txs or reuse from Txs our Table-Txs

<script lang="ts">
import { Block, EthValue, Tx, PendingTx } from '@app/core/models'
import { Events } from 'ethvm-common'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AddressDetail from '@app/modules/addresses/components/AddressDetail.vue'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TableAddressTxs from '@app/modules/addresses/components/TableAddressTxs.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import TableAddressTokens from '@app/modules/addresses/components/TableAddressTokens.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
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
    AppTabs,
    AddressDetail,
    TableAddressTxs,
    TableBlocks,
    TableAddressTokens
  }
})
export default class PageDetailsAddress extends Vue {
  @Prop({ type: String, default: '' }) addressRef!: string

  detailsType = null
  error = false
  loading = true

  account: AccountInfo = null

  /*Transactions: */
  txsLoading = true
  txsError = false

  /* Pending Txs: */
  pendingTxsLoading = true
  pendingTxsError = false

  /* Tokens: */
  tokensLoading = true
  tokensError = false

  /* Miner Blocks: */
  minerBlocksLoading = true
  minerBlocksError = false

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
          // Get Address Metadata
          const addressMetadataPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getAddressMetadata,
              {
                address: this.addressRef
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get Address Balance
          const addressBalancePromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getAddressBalance,
              {
                address: this.addressRef
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get contract metadata (if applicable)
          const contractPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getContract,
              {
                address: this.addressRef
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get USD exchange rate
          const exchangeRatePromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getExchangeRates,
              {
                symbol: 'ETH',
                to: 'USD'
              },
              (err, result) => (err || !result ? reject(err) : resolve(result))
            )
          })

          Promise.all(
            // If one promise fails, we still continue processing every entry (and for those failed we receive undefined)
            [addressMetadataPromise, addressBalancePromise, contractPromise, exchangeRatePromise].map(p => p.catch(() => undefined))
          )
            .then((res: any[]) => {
              // Address Metadata
              const addressMetadata = res[0] || {}
              this.account.isCreator = addressMetadata.isContractCreator || false
              this.account.isMiner = addressMetadata.isMiner || false
              this.account.totalTxs = addressMetadata.totalTxCount || 0
              this.account.toTxCount = addressMetadata.toTxCount || 0
              this.account.fromTxCount = addressMetadata.fromTxCount || 0

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
          // Get Address Transactions
          const addressTxsPromise = this.loadTx()

          // Get Address Pending Transactions
          const addressPendingTxsPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getPendingTxsOfAddress,
              {
                address: this.addressRef,
                page: 0,
                limit: MAX_ITEMS,
                filter: 'all' // TODO @Olga: Possible values: in, out, all (if not specified all is taken)
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get Mined Blocks
          const minedBlocksPromise = new Promise((resolve, reject) => {
            if (!this.account.isMiner) {
              resolve([])
              return
            }
            this.$socket.emit(
              Events.getBlocksMined,
              {
                address: this.addressRef,
                page: 0,
                limit: MAX_ITEMS
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get contracts created by
          const contractsCreatedBy = new Promise((resolve, reject) => {
            if (!this.account.isCreator) {
              resolve([])
              return
            }
            this.$socket.emit(
              Events.getContractsCreatedBy,
              {
                address: this.addressRef,
                page: 0,
                limit: MAX_ITEMS
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          Promise.all([addressTxsPromise, addressPendingTxsPromise, minedBlocksPromise, contractsCreatedBy].map(p => p.catch(() => undefined)))
            .then((res: any[]) => {
              // Txs
              const rawTxs = res[0] || []
              const txs = []
              rawTxs.forEach(raw => txs.unshift(new Tx(raw)))
              this.account.txs = txs
              this.txsLoading = false

              // Pending Txs
              const rawPtxs = res[1] || []
              const pTxs = []
              rawPtxs.forEach(raw => pTxs.unshift(new PendingTx(raw)))
              this.account.pendingTxs = pTxs
              this.pendingTxsLoading = false

              // Mined Blocks
              const rawMinedBlocks = res[2] || []
              const minedBlocks = []
              rawMinedBlocks.forEach(raw => minedBlocks.unshift(new Block(raw)))
              this.account.minedBlocks = minedBlocks
              this.minerBlocksLoading = false

              // Contract Creator
              const rawContractCreated = res[3] || []
              const contractsCreated = []
              contractsCreated.forEach(raw => rawContractCreated.unshift(raw))
              this.account.contracts = contractsCreated

              this.sm.transition('load-token-complementary-info')
            })
            .catch(err => this.sm.transition('error'))
        }
      },
      {
        name: 'load-token-complementary-info',
        enter: () => {
          // Get Tokens Owned
          const totalTokensOwnedPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getAddressTokenBalance,
              {
                address: this.addressRef
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          Promise.all([totalTokensOwnedPromise].map(p => p.catch(() => undefined)))
            .then((res: any[]) => {
              // Tokens
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
  loadTx(page = 0, limit = MAX_ITEMS, filter = 'all'): Promise<Tx[]> {
    return new Promise((resolve, reject) => {
      this.$socket.emit(
        Events.getAddressTxs,
        {
          address: this.addressRef,
          page,
          limit,
          filter
        },
        (err, result) => (err ? reject(err) : resolve(result))
      )
    })
  }

  // Computed
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
    return tabs
  }
}
</script>
