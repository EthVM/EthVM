<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />

    <div v-if="!loading">
      <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12> <address-detail :account="account" :type-addrs="detailsType" /> </v-flex>
      </v-layout>

      <app-tabs :tabs="pageTabs">
        <!-- Transactions -->
        <v-tab-item value="tab-0">
          <table-address-txs v-if="!txsError" :loading="txsLoading" :address="account.address" :transactions="account.txs" />
          <app-error-no-data v-else />
        </v-tab-item>

        <!-- Tokens -->
        <v-tab-item slot="tabs-item" value="tab-1">
          <table-tokens v-if="!tokensError" :tokens="account.tokens" :loading="tokensLoading" :error="tokensError" />
          <app-error-no-data v-else />
        </v-tab-item>

        <!-- Pending Transactions -->
        <v-tab-item value="tab-2">
          <table-address-txs v-if="!pendingTxsError" :address="account" :transactions="account.pendingTxs" :is-pending="true" />
          <app-error-no-data v-else />
        </v-tab-item>

        <!-- Mined Blocks -->
        <v-tab-item slot="tabs-item" v-if="account.isMiner" value="tab-3">
          <table-blocks v-if="!minerminerBlocksError" :blocks="blocks" :loading="minerBlocksLoading" :page-type="detailsType" />
        </v-tab-item>

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

<script lang="ts">
import { EthValue, Tx, PendingTx } from '@app/core/models'
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
import { resolve } from 'path';

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

  data() {
    return {
      pageTabs: [
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
    }
  }

  created() {
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
            (err, result) => err ? reject(err) : resolve(result)
          )
          })

          // Get contract metadata (if applicable)
          const contractPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getContract,
              {
                address: this.addressRef.replace('0x', '')
              },
              (err, result) => err ? reject(err) : resolve(result)
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
              (err, result) => err || !result ? reject(err) : resolve(result)
            )
          })

          // Get Total Number of Tx
          const totalTxsPromise = new Promise((resolve, reject) => {
            this.$socket.emit(
              Events.getAddressTotalTxs,
              {
                address: this.addressRef.replace('0x', '')
              },
              (err, result) => err ? reject(err) : resolve(result)
            )
          })

          Promise.all([addressBalancePromise, contractPromise, exchangeRatePromise, totalTxsPromise])
          .then((res: any[]) => {
            this.account.balance = res[0] ? new EthValue(res[0].amount) : new EthValue(0)
            this.account.type = res[1] ? CONTRACT_DETAIL_TYPE : ADDRESS_DETAIL_TYPE
            this.account.exchangeRate.USD = res[2].price
            this.account.totalTxs = res[3] ? res[3] : 0

            this.sm.transition('success')
          })
          .catch(err => this.sm.transition('error'))
        }
      },
      {
        name: 'load-complementary-info',
        enter: () => {
          // Getting Address Transactions
          this.$socket.emit(
            Events.getAddressTxs,
            {
              address: this.addressRef.replace('0x', ''),
              limit: MAX_ITEMS,
              page: 0
            },
            (err, result) => {
              const txs = []
              result.forEach(element => txs.unshift(new Tx(element)))
              this.account.txs = txs
            }
          )

          // Getting Address Pending Transactions
          this.$socket.emit(
            Events.getPendingTxsOfAddress,
            {
              address: this.addressRef.replace('0x', ''),
              limit: MAX_ITEMS,
              page: 0
            },
            (err, result) => {
              const pTxs = []
              result.forEach(element => pTxs.unshift(new PendingTx(element)))
              this.account.pendingTxs = pTxs
            }
          )
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

          console.error('Error!')
        }
      }
    ])

    // 2. Kickstart State Machine
    this.sm.transition('initial')
  }

  // mounted() {
  //   if (this.account.miner || this.account.creator) {
  //     this.setTabs()
  //   }
  // }

  // Methods

  fetchData() {

    // Getting Token Balances
    // this.$socket.emit(
    //   Events.getTokenBalance,
    //   {
    //     address: this.addressRef.replace('0x', '')
    //   },
    //   (err, result) => {
    //     if (result !== '0x') {
    //       this.tokens = result
    //       this.tokensLoad = true
    //     } else {
    //       this.tokensError = true
    //     }
    //   }
    // )

    /* Call to check if miner, and get Blocks
      if (miner) --> account.isMiner = true
      on blocks load --> blockLoad = false
    */

    /* Call to check if contract creator, and get list of contracts
      if (creator) --> account.conCreator = true
      on contracts load --> contractLoad = false
    */
  }

  updateTabs() {
    if (this.account.miner) {
      const newTab = {
        id: '3',
        title: this.$i18n.t('tabs.miningH'),
        isActive: false
      }
      this.pageTabs.push(newTab)
    }

    if (this.account.creator) {
      const newTab = {
        id: '4',
        title: this.$i18n.t('tabs.contracts'),
        isActive: false
      }
      this.pageTabs.push(newTab)
    }
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
}
</script>
