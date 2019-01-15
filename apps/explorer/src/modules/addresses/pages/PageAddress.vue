<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12> <app-address-detail :account="account" :type-addrs="detailsType"></app-address-detail> </v-flex>
    </v-layout>
    <app-tabs :tabs="pageTabs">
      <!-- Tokens -->
      <v-tab-item slot="tabs-item" value="tab-1"> <table-tokens :tokens="tokens" :loading="tokensLoad" :error="tokensError" /> </v-tab-item> -->
      <!-- Mined Blocks -->
      <v-tab-item slot="tabs-item" v-if="account.isMiner" value="tab-3">
        <table-blocks :blocks="blocks" :loading="blocksLoad" :page-type="detailsType" />
      </v-tab-item>

      <v-tab-item v-if="account.conCreator" value="tab-4">
        <!-- Contract Creator (no need to implement yet) -->
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
    </app-tabs>

    <!-- Transactions
        <v-tab-item value="tab-0">
          <table-address-txs v-if="account.txs" :address="account.address" :transactions="account.txs"></table-address-txs>
          <app-error-no-data v-else></app-error-no-data>
        </v-tab-item> -->

    <!-- Pending Transactions
        <v-tab-item value="tab-2">
          <table-address-txs v-if="account.pendingTxs" :address="account" :transactions="account.pendingTxs" :is-pending="true"></table-address-txs>
          <app-error-no-data v-else></app-error-no-data>
        </v-tab-item> -->

    <!-- End Mining History  -->

    <!-- End Address Details -->
    <!-- Tab Menu -->
  </v-container>
</template>

<script lang="ts">
import { Tx, Account, PendingTx } from '@app/core/models'
import { Events } from 'ethvm-common'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppAddressDetail from '@app/modules/addresses/components/AppAddressDetail.vue'
import TableAddressTxs from '@app/modules/addresses/components/TableAddressTxs.vue'
import TableTokens from '@app/modules/tokens/components/TableTokens.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { AccountInfo } from '@app/modules/addresses/props'
/*  NOTES:
This componet should convvert wei values (address balance) to ETH, should be added after Buffer object implementation  */

@Component({
  components: {
    AppBreadCrumbs,
    AppAddressDetail,
    TableTokens,
    TableAddressTxs,
    TableBlocks,
    AppTabs
  }
})
export default class PageAddress extends Vue {
  @Prop({ type: String, default: '' }) address!: string

  detailsType = 'address'
  account = new AccountInfo(this.address, this.detailsType)
  /*Transactions: */

  txs = []
  txsLoad = true
  txsError = false

  /*Pending: */
  pending = []
  pendingLoad = true
  pendingError = false

  /*Tokens: */

  /*Tokens: */
  tokens = []
  tokensLoad = true
  tokensError = false

  /* USD */
  usdValue = {
    ETH: {
      value: 0
    }
  }
  /* Blocks: */
  blocks = []
  blocksLoad = true
  blocksError = false

  /* Contracts: */
  contracts = []
  contractsLoad = true
  contractsError = false

  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.address'),
          disabled: true
        }
      ],
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
    /* Geting Address : */
    this.$socket.emit(
      Events.getAddressBalance,
      {
        address: this.address.replace('0x', '')
      },
      (err, result) => {
        if (!err && result) {
          const addr = new Account(result)
          this.account.setBalance(addr.getBalance())
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
      Events.getAddressTotalTxs,
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
      Events.getPendingTxsOfAddress,
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

    /* Call to check if miner, and get Blocks
      if (miner) --> account.isMiner = true
      on blocks load --> blockLoad = false
    */

    /* Call to check if contract creator, and get list of contracts
      if (creator) --> account.conCreator = true
      on contracts load --> contractLoad = false
    */
  }

  mounted() {
    if (this.account.isMiner || this.account.conCreator) {
      this.setTabs()
    }
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
      this.pageTabs.push(newTab)
    }
    if (this.account.conCreator) {
      const newTab = {
        id: '4',
        title: this.$i18n.t('tabs.contracts'),
        isActive: false
      }
      this.pageTabs.push(newTab)
    }
  }
}
</script>
