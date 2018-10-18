<template>
  <v-container grid-list-lg class="mt-0">
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <v-card fluid flat color="transparent">
          <v-breadcrumbs large>
            <v-icon slot="divider">fa fa-arrow-right</v-icon>
            <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link">
              {{ item.text }}
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <address-detail :account="account"></address-detail>
      </v-flex>
    </v-layout>
    <!-- End Address Details -->

    <!-- Tab Menu -->
    <tab-component :tabs="addressTabs"></tab-component>
    <!-- End Tab Menu -->
    <!--Tab Content -->
    <div class="tab-menu-container">
      <!-- Transactions -->
      <div v-if="addressTabs[0].isActive">
        <div v-if="account.txs">
          <block-address-tx :address='account' :transactions='account.txs' :isPending='false'></block-address-tx>
        </div>
        <!-- End Transactions -->
      </div>
      <!-- Tokens -->
      <div v-if="addressTabs[1].isActive">
        <div v-if="!tokenError">
          <div v-if="tokensLoaded">
            <block-token-tracker :tokens="account.tokens" :holder="account.address"></block-token-tracker>
          </div>
          <div v-else class="loading-tokens">
            <i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
            <span class="sr-only">{{ $t('message.load') }}</span>
          </div>
        </div>
        <div v-else class="info-common">
          <p> {{ $t('message.error') }}</p>
        </div>
        <!-- End Tokens -->
      </div>
      <!-- Pending Transactions -->
      <div v-if="addressTabs[2].isActive" class="">
        <block-address-tx :address='account' :transactions='account.pendingTxs' :isPending='true'></block-address-tx>

        <!-- End Pending Transactions -->
      </div>
      <!--Mining History This are temp strings (no need to implement yet)  -->
      <div v-if="account.isMiner">
        <div v-if="addressTabs[3].isActive">
          <div>
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
          </div>
        </div>
        <!--End Mining History -->
      </div>
      <!-- End Tab Content -->
    </div>
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Tx, Account, PendingTx } from '@app/models'
import bn from 'bignumber.js'
import blockies from 'ethereum-blockies'
import ethUnits from 'ethereumjs-units'
import sEvents from '@app/configs/socketEvents.json'
import Vue from 'vue'

const MAX_ITEMS = 20

export default Vue.extend({
  name: 'FrameAccount',
  props: ['address', 'tokens', 'txs', 'pendingTxs'],
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
        isMiner: false,
        conCreator: false
      },
      identicon: null,
      items: [
        {
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
        {
          text: this.$i18n.t('title.address'),
          disabled: true
        }
      ],
      addressTabs: [
        {
          id: 0,
          title: this.$i18n.t('tabs.txH'),
          isActive: true
        },
        {
          id: 1,
          title: this.$i18n.t('tabs.tokens'),
          isActive: false
        },
        {
          id: 2,
          title: this.$i18n.t('tabs.pending'),
          isActive: false
        }
      ],
      tokensLoaded: false,
      tokenError: false,
      usdValue: {
        ETH: {
          value: 0
        }
      }
    }
  },
  created() {
    /* Geting Address Balance: */
    this.$socket.emit(
      sEvents.getAddress,
      {
        address: this.address.replace('0x', '')
      },
      (err, result) => {
        const addr = new Account(result)
        if (!err && result) {
          const balance = addr.getBalance().toEth()
          this.account.balance = balance
        }
      }
    )
    /* Getting Token Balances: */
    this.$socket.emit(
      sEvents.getTokenBalance,
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
      sEvents.getTotalTxs,
      {
        address: this.address.replace('0x', '')
      },
      (err, result) => {
        this.account.totalTxs = result
      }
    )
    /*Getting USD Values: */
    this.$socket.emit(
      sEvents.getTicker,
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
      sEvents.getTxs,
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
      sEvents.pendingTxsAddress,
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

    this.setTabs()
  },
  mounted() {
    this.getIdenticon()
  },
  methods: {
    /*Checking of address is Miner? --> add new tab for the menu*/
    setTabs() {
      if (this.account.isMiner) {
        const newTab = {
          id: 3,
          title: this.$i18n.t('tabs.miningH'),
          isActive: false
        }
        this.addressTabs.push(newTab)
      }
    },
    getIdenticon() {
      this.identicon = document.getElementById('icon')
      this.identicon.style.backgroundImage =
        'url(' +
        blockies
          .create({
            seed: this.account.address,
            size: 5,
            scale: 3
          })
          .toDataURL() +
        ')'
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/frames/address.less';
</style>
