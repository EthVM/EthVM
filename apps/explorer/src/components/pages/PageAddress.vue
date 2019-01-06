<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12> <app-address-detail :account="account"></app-address-detail> </v-flex>
    </v-layout>
    <!-- End Address Details -->
    <!-- Tab Menu -->
    <v-card color="white" flat>
      <v-tabs
        v-model="activeTab"
        color="white"
        show-arrows
        :class="{ 'pl-0 pr-0': $vuetify.breakpoint.smAndDown, 'pl-3 pr-3': $vuetify.breakpoint.mdAndUp, 'pt-2': $vuetify.breakpoint.mdAndUp }"
      >
        <v-tab
          v-for="item in tabs"
          class="info--text text-capitalize pb-2 tab-opacity"
          active-class="primary--text "
          :key="item.id"
          :href="'#tab-' + item.id"
          ripple
          >{{ item.title }}</v-tab
        >
        <v-tabs-slider color="primary" class="mb-0" style="height: 4px;"></v-tabs-slider>
      </v-tabs>
      <v-tabs-items v-model="activeTab" style="border-top: 1px solid #efefef">
        <!-- Transactions -->
        <v-tab-item value="tab-0">
          <table-address-txs v-if="account.txs" :address="account.address" :transactions="account.txs"></table-address-txs>
          <app-error-no-data v-else></app-error-no-data>
        </v-tab-item>
        <!-- Tokens -->
        <v-tab-item value="tab-1">
          <div v-if="!tokenError">
            <div v-if="tokensLoaded"><app-token-tracker :tokens="account.tokens" :holder="account.address"></app-token-tracker></div>
            <v-card flat v-else class="loading-tokens">
              <i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i> <span class="sr-only">{{ $t('message.load') }}</span>
            </v-card>
          </div>
          <app-error-no-data v-else></app-error-no-data>
        </v-tab-item>
        <!-- End Tokens -->
        <!-- Pending Transactions -->
        <v-tab-item value="tab-2">
          <table-address-txs v-if="account.pendingTxs" :address="account" :transactions="account.pendingTxs" :is-pending="true"></table-address-txs>
          <app-error-no-data v-else></app-error-no-data>
        </v-tab-item>
        <v-tab-item v-if="account.isMiner" value="tab-3">
          <!-- Mining History This are temp strings (no need to implement yet) -->
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
        </v-tab-item>
        <!-- End Mining History -->
        <v-tab-item v-if="account.conCreator" value="tab-4">
          <!-- Mining History This are temp strings (no need to implement yet) -->
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
        </v-tab-item>
        <!-- End Mining History -->
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import bn from 'bignumber.js'
import blockies from 'ethereum-blockies'
import ethUnits from 'ethereumjs-units'
import { Tx, Account, PendingTx } from '@app/models'
import { Events } from 'ethvm-common'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import AppAddressDetail from '@app/components/ui/AppAddressDetail.vue'
// import AppTokenTracker from '@app/components/ui/AppTokenTracker.vue'
import TableAddressTxs from '@app/components/tables/TableAddressTxs.vue'
import AppErrorNoData from '@app/components/ui/AppErrorNoData.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

const MAX_ITEMS = 20

@Component({
  components: {
    AppBreadCrumbs,
    AppAddressDetail,
    // AppTokenTracker,
    TableAddressTxs
    // AppErrorNoData
  }
})
export default class PageAddress extends Vue {
  @Prop({ type: String, default: '' }) address!: string
  @Prop({ type: Array, default: () => [] }) tokens!: any
  @Prop({ type: Array, default: () => [] }) txs!: Tx[]
  @Prop({ type: Array, default: () => [] }) pendingTxs!: PendingTx[]

  data() {
    return {
      account: {
        address: this.address,
        balance: 0,
        balanceUSD: 0,
        ethusd: 0,
        totalTxs: 0,
        tokens: this.tokens,
        txs: this.txs,
        pendingTxs: this.pendingTxs,
        isMiner: true,
        conCreator: false
      },
      items: [
        {
          text: this.$i18n.t('title.address'),
          disabled: true
        }
      ],
      tabs: [
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
      ],
      activeTab: 'tab-0',
      addressTabs: [],
      tokensLoaded: false,
      tokenError: false,
      usdValue: {
        ETH: {
          value: 0
        }
      }
    }
  }

  created() {
    /* Geting Address Balance: */
    this.$socket.emit(
      Events.getAccount,
      {
        address: this.address.replace('0x', '')
      },
      (err, result) => {
        const addr = new Account(result)
        if (!err && result) {
          const balance = addr.getBalance()
          this.account.balance = balance
        }
      }
    )

    /* Getting Token Balances: */
    this.$socket.emit(
      Events.getTokenBalance,
      {
        address: this.address
      },
      (err, result) => {
        if (result !== '0x') {
          this.account.tokens = result
          this.tokensLoaded = true
        } else {
          this.tokenError = true
        }
      }
    )

    /* Getting Total Number of Tx: */
    this.$socket.emit(
      Events.getTotalTxs,
      {
        address: this.address.replace('0x', '')
      },
      (err, result) => {
        this.account.totalTxs = result
      }
    )

    /*Getting USD Values: */
    this.$socket.emit(
      Events.getExchangeRates,
      {
        symbol: 'ETH',
        to: 'USD'
      },
      (err, result) => {
        this.account.ethusd = result.price
      }
    )

    /*Getting Address Transactions: */
    this.$socket.emit(
      Events.getAddressTxs,
      {
        address: this.address.replace('0x', ''),
        limit: 10,
        page: 0
      },
      (err, result) => {
        const txs = []
        result.forEach(element => {
          txs.push(new Tx(element))
        })
        this.account.txs = txs
      }
    )

    /*Getting Address Pending Transactions: */
    this.$socket.emit(
      Events.pendingTxsAddress,
      {
        address: this.address.replace('0x', ''),
        limit: 10,
        page: 0
      },
      (err, result) => {
        const pTxs = []
        result.forEach(element => {
          pTxs.push(new PendingTx(element))
        })
        this.account.pendingTxs = pTxs
      }
    )
  }

  // Methods

  /*Checking of address is Miner? --> add new tab for the menu*/
  setTabs() {
    if (this.account.isMiner) {
      const newTab = {
        id: '3',
        title: this.$i18n.t('tabs.miningH'),
        isActive: false
      }
      this.addressTabs.push(newTab)
    }
    if (this.account.conCreator) {
      const newTab = {
        id: '4',
        title: this.$i18n.t('tabs.contracts'),
        isActive: false
      }
      this.addressTabs.push(newTab)
    }
  }
}
</script>
