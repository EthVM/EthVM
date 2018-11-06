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
    <v-card color="white" flat>
      <v-tabs v-model="activeTab" color="white" show-arrows :class="{'pl-0 pr-0': $vuetify.breakpoint.smAndDown, 'pl-3 pr-3': $vuetify.breakpoint.mdAndUp, 'pt-2': $vuetify.breakpoint.mdAndUp }">
        <v-tab v-for="(item) in tabs" class="info--text text-capitalize pb-2 tab-opacity" active-class="primary--text " :key="item.title" ripple>
          {{ item.title }}
        </v-tab>
        <v-tabs-slider color="primary" class="mb-0" style="height: 4px;"></v-tabs-slider>
      </v-tabs>
      <v-tabs-items v-model="activeTab" style="border-top: 1px solid #efefef">
        <!-- Transactions-->
        <v-tab-item id="tab-0">
          <block-address-tx v-if="account.txs" :address='account.address' :transactions='account.txs' ></block-address-tx>
        </v-tab-item>
        <!-- Tokens -->
        <v-tab-item id="tab-1">
          <div v-if="!tokenError">
            <div v-if="tokensLoaded">
              <block-token-tracker :tokens="account.tokens" :holder="account.address"></block-token-tracker>
            </div>
            <v-card flat v-else class="loading-tokens">
              <i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
              <span class="sr-only">{{ $t('message.load') }}</span>
            </v-card>
          </div>
          <v-card v-else class="info-common">
            <p> {{ $t('message.error') }}</p>
          </v-card>
        </v-tab-item>
        <!-- End Tokens -->
        <!-- Pending Transactions -->
        <v-tab-item id="tab-2">
          <!--<block-address-tx :address='account' :transactions='account.pendingTxs' :isPending='true'></block-address-tx> -->
        </v-tab-item>
        <v-tab-item v-if="account.isMiner" id="tab-3">
          <!--Mining History This are temp strings (no need to implement yet)  -->
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
        <!--End Mining History -->
        <v-tab-item v-if="account.conCreator" id="tab-4">
          <!--Mining History This are temp strings (no need to implement yet)  -->
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
        <!--End Mining History -->
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import bn from 'bignumber.js'
import blockies from 'ethereum-blockies'
import ethUnits from 'ethereumjs-units'
import {Tx, Account, PendingTx } from '@app/models'
import { Events as sEvents } from 'ethvm-common'
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
        isMiner: true,
        conCreator: false
      },
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
      sEvents.getAccount,
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
    this.$socket.emit(sEvents.getExchangeRates, { symbol: 'ETH', to: 'USD' }, (err, result) => {
      this.account.ethusd = result.price
    })
    /*Getting Address Transactions: */
    this.$socket.emit(
      sEvents.getAddressTxs,
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
  methods: {
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
})
</script>
