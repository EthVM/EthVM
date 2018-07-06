<template>
  <div v-if="transactions" class="address-tx">
    <!-- Tx Header -->
    <div class="address-tx-header">
      <div class="filter-tx">
        <div class="tx-tabs">
          <span> View: </span>
          <button v-for="option in options" v-bind:class="{ active: isActive(option.value)}" v-on:click="setFilter(option.value)">
            {{option.text}}
          </button>
        </div>
        <span>Selected: {{ getTotal }} transactions</span>
      </div>
      <div class="search-block">
        <block-search :phText="placeholder"></block-search>
      </div>
      <!-- End Tx Header -->
    </div>
    <!-- Tx Table Header -->
    <block-address-tx-table :transactions=' filteredTxs' :showheader='true' :account='address.address' :filter="filter" :total="getTotal" :isPending="false">
    </block-address-tx-table>
    <!-- End Tx Table Header -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'TableTransactions',
  props: [
    'address',
    'transactions',
    'isPending'
  ],
  data() {
    return {
      placeholder: 'Search Address/Tx Hash',
      options: [{
        text: 'All',
        value: 'all'
      }, {
        text: 'Incoming',
        value: 'in'
      }, {
        text: 'Outgoing',
        value: 'out'
      }],
      filter: 'all',
      inTx: [],
      outTx: [],
      recievedTx: false,
    }
  },
  created() {},
  mounted() {},
  methods: {
    setFilter(option) {
      let _this = this
      _this.filter = option
    },
    isActive(value) {
      let _this = this
      if (value == _this.filter) return true
      return false
    },
    getTxsType() {
      let _this = this
      var i
      for (i = 0; i < _this.transactions.length; i++) {
        if (_this.transactions[i].from == _this.address) {
          _this.outTx.push(_this.transactions[i])
        } else {
          _this.inTx.push(_this.transactions[i])
        }
      }
      _this.recievedTx = true

    }
  },
  computed: {
    filteredTxs() {
      let _this = this
      if (_this.filter == 'all') return _this.transactions
      if (_this.transactions) {
        if (!_this.recievedTx) _this.getTxsType()
        if (_this.filter == 'out') return _this.outTx
        if (_this.filter == 'in') return _this.inTx

      }
    },
    getTotal() {
      let _this = this
      if (_this.transactions) {
        if (_this.filter == 'all') return _this.transactions.length
        if (_this.filter == 'in') return _this.inTx.length
        else return _this.outTx.length
      }
      return 0
    }
  }
});
</script>
<style scoped="" lang="less">
@import "~lessPath/sunil/blocks/largeBlocks/addressTx.less";
</style>
