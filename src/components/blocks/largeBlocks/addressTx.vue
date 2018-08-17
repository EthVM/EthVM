<template>
  <div v-if="transactions" class="address-tx">
    <!-- Tx Header -->
    <div class="address-tx-header">
      <div class="filter-tx">
        <div class="tx-tabs">
          <span> {{ $t( 'filter.view')}}: </span>
          <button v-for="option in options" v-bind:key="option.text" v-bind:class="{ active: isActive(option.value)}" v-on:click="setFilter(option.value)">
              {{option.text}}
            </button>
        </div>
        <!-- This will be removed to pagination -->
        <span>Selected: {{ getTotal }} transactions</span>
      </div>
      <div class="search-block">
        <block-search :phText="placeholder"></block-search>
      </div>
      <!-- End Tx Header -->
    </div>
    <!-- Tx Table Header -->
    <block-address-tx-table :transactions=' filteredTxs' :showheader='true' :account='address.address' :filter="filter" :total="getTotal" :isPending="isPending">
    </block-address-tx-table>
    <!-- End Tx Table Header -->
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'TableTransactions',
    props: ['address', 'transactions', 'isPending'],
    data() {
      return {
        placeholder: 'addressTxSearch',
        options: [{
            text: this.$i18n.t( 'filter.all'),
            value: 'all'
          },
          {
            text: this.$i18n.t( 'filter.in'),
            value: 'in'
          },
          {
            text: this.$i18n.t( 'filter.out'),
            value: 'out'
          }
        ],
        filter: 'all',
        inTx: [],
        outTx: [],
        recievedTx: false
      }
    },
    methods: {
      setFilter(option) {
        this.filter = option
      },
      isActive(value) {
        if (value === this.filter) {
          return true
        }
        return false
      },
      getTxsType() {
        let i
        for (i = 0; i < this.transactions.length; i++) {
          if (
            this.transactions[i]
            .getFrom()
            .toString()
            .toLowerCase() === this.address.address.toLowerCase()
          ) {
            this.outTx.push(this.transactions[i])
          } else {
            this.inTx.push(this.transactions[i])
          }
        }
        this.recievedTx = true
      }
    },
    computed: {
      filteredTxs() {
        if (this.filter === 'all') {
          return this.transactions
        }
        if (this.transactions) {
          if (!this.recievedTx) {
            this.getTxsType()
          }
          if (this.filter === 'out') {
            return this.outTx
          }
          if (this.filter === 'in') {
            return this.inTx
          }
        }
      },
      getTotal() {
        if (this.transactions) {
          if (this.filter === 'all') {
            return this.transactions.length
          }
          if (this.filter === 'in') {
            return this.inTx.length
          }
          else {
            return this.outTx.length
          }
        }
        return 0
      }
    }
  })
</script>

<style scoped="" lang="less">
  @import '~lessPath/sunil/blocks/largeBlocks/addressTx.less';
</style>
