<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />

    <div v-if="!loading">
      <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12> <address-detail :account="account" :type-addrs="detailsType" /> </v-flex>
      </v-layout>

      <app-tabs :tabs="tabs">
        <!-- Transactions -->
        <v-tab-item slot="tabs-item" value="tab-0">
          <table-address-txs v-if="!txsError" :loading="txsLoading" :address="account.address" :txs="account.txs" :totalTxs="account.totalTxs" />
          <app-error-no-data v-else />
        </v-tab-item>
        <!-- End Transactions -->

        <!-- Tokens -->
        <v-tab-item slot="tabs-item" value="tab-1">
          <table-tokens v-if="!tokensError" :loading="tokensLoading" :tokens="account.tokens" :error="tokensError" />
          <app-error-no-data v-else />
        </v-tab-item>
        <!-- End Tokens -->

        <!-- Pending Transactions -->
        <v-tab-item slot="tabs-item" value="tab-2">
          <table-address-txs
            v-if="!pendingTxsError"
            :loading="pendingTxsLoading"
            :address="account.address"
            :txs="account.pendingTxs"
            :is-pending="true"
          />
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
import TableTokens from '@app/modules/tokens/components/TableTokens.vue'
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
    TableTokens
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
          // Get Address Balance
          const addressBalancePromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getAddressBalance,
              {
                address: this.addressRef.replace('0x', '')
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get contract metadata (if applicable)
          const contractPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getContract,
              {
                address: this.addressRef.replace('0x', '')
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

          // Get Total Number of Tx
          const totalTxsPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getAddressTotalTxs,
              {
                address: this.addressRef.replace('0x', '')
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          Promise.all(
            // If one promise fails, we still continue processing every entry (and for those failed we receive undefined)
            [addressBalancePromise, contractPromise, exchangeRatePromise, totalTxsPromise].map(p => p.catch(() => undefined))
          )
            .then((res: any[]) => {
              this.account.balance = res[0] ? new EthValue(res[0].amount) : new EthValue(0)
              this.account.type = res[1] ? CONTRACT_DETAIL_TYPE : ADDRESS_DETAIL_TYPE
              this.account.exchangeRate.USD = res[2].price
              this.account.totalTxs = res[3] ? res[3] : 0
              this.sm.transition('load-complementary-info')
            })
            .catch(err => this.sm.transition('error'))
        }
      },
      {
        name: 'load-complementary-info',
        enter: () => {
          // Get Address Transactions
          const addressTxsPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getAddressTxs,
              {
                address: this.addressRef.replace('0x', ''),
                limit: MAX_ITEMS,
                page: 0,
                filter: 'all' // TODO @Olga: Possible values: in, out, all (if not specified all is taken)
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get Total Token Balances
          // TODO @Olga: Not working I need to take a look on vm service and ask Kosala
          this.$socket.emit(
            Events.getTokenBalance,
            {
              address: this.addressRef.replace('0x', '')
            },
            (err, result) => {
              // console.log('Token balance: ', result)
            }
          )

          // Get Tokens Transfers
          // TODO: I need to prepare a bigger dataset in order to have in our db a couple of those

          // Get Address Pending Transactions
          const addressPendingTxsPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getPendingTxsOfAddress,
              {
                address: this.addressRef.replace('0x', ''),
                page: 0,
                limit: MAX_ITEMS,
                filter: 'all' // TODO @Olga: Possible values: in, out, all (if not specified all is taken)
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get Mined Blocks
          const minedBlocksPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getBlocksMined,
              {
                address: this.addressRef.replace('0x', ''),
                page: 0,
                limit: MAX_ITEMS
              },
              (err, result) => (err ? reject(err) : resolve(result))
            )
          })

          // Get contracts created by
          const contractsCreatedBy = new Promise((resolve, reject) => {
            this.$socket.emit(
              'getContractsCreatedBy', // TODO: Create proper Events (not done yet as we're improving commons)
              {
                address: this.addressRef.replace('0x', ''),
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
              if (rawMinedBlocks.length > 0) {
                this.account.isMiner = true
              }

              // Contract Creator
              const rawContractCreated = res[3] || []
              const contractsCreated = []
              contractsCreated.forEach(raw => rawContractCreated.unshift(raw)) // TODO: Update contract model
              this.account.created = contractsCreated
              if (rawContractCreated.length > 0) {
                this.account.isCreator = true
              }

              this.sm.transition('success')
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

    if (this.account.creator) {
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
