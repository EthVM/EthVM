<template>
  <div class="address-tx">
    <!-- Tx Header -->
    <div class="address-tx-header">
      <div class="filter-tx">
        <div class="tx-tabs">
          <span> View: </span>
          <button v-for="option in options" v-bind:class="{ active: isActive(option.value)}" v-on:click="setFilter(option.value)">
            {{option.text}}
          </button>
        </div>
        <span>Selected: {{ filter }} transactions</span>
      </div>
      <div class="search-block">
        <block-search :phText="placeholder"></block-search>
      </div>
      <!-- End Tx Header -->
    </div>
    <!-- Tx Table Header -->
    <block-address-tx-table :transactions='transactions' :showheader='true' :account='address.address'>
    </block-address-tx-table>
    <!-- End Tx Table Header -->
  </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'TableTransactions',
  props: [
    'address'
  ],
  data() {
    return {
      placeholder: 'Search Address/Tx Hash',
      options: [{
        text: 'All',
        value: 'all',
        isActive: true
      }, {
        text: 'Incoming',
        value: 'in',
        isActive: false
      }, {
        text: 'Outgoing',
        value: 'out',
        isActive: false
      }],
      filter: 'all',
      inTx: {},
      outTx: {},
    }
  },
  created() {
    let _this = this
    _this.getTxsType(_this.address.txs)
  },
  methods: {
    setFilter(option) {
      let _this = this
      _this.filter = option
      console.log(_this.address.txs)
    },
    isActive(value) {
      let _this = this
      if (value == _this.filter) return true
      return false
    },
    getTxsType(address) {
        console.log(address.txs)
        /*let inTxs = {}
        let outTxs = {}
        let x = {}
        address.txs.forEach(x) {
            if(x.from == address.address) {
                outTxs.push(x)
            }
            else{
                inTxs.push(x)
            }
        } */
    }

  },
  computed: {
    transactions () {
        let _this = this
        if (_this.filter == 'out') return _this.outTx
        if (_this.filter == 'in') return _this.inTx
        return _this.address.txs
    }
  }
})
</script>
<style scoped="" lang="less">
@import "~lessPath/sunil/blocks/largeBlocks/addressTx.less";
</style>
