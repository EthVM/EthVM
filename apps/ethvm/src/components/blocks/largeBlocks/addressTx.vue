<template>
  <v-card color="white" flat v-if="transactions" class="pl-3 pr-3 pt-2">
    <!-- Tx Header -->
    <v-layout align-center justify-space-between row fill-height>
      <v-flex d-flex xs12 sm6 md4>
        <v-layout row align-center justify-start fill-height height="40px">
          <v-flex xs10 pr-0>
            <v-card flat style="border-top: solid 1px #efefef; border-left: solid 1px #efefef; border-bottom: solid 1px #efefef;" height="36px" class="pr-3 pl-3 pt-2">
              <input :placeholder="$t('search.addressTx')" v-model="searchInput" class="width: 100%">
            </v-card>
          </v-flex>
          <v-flex xs2 pl-0>
            <v-btn depressed outline class="primary--text text-capitalize ml-0 lineGrey" @click="searching">Search</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex d-flex xs12 sm4 md3 lg2>
        <v-layout row align-center justify-start fill-height height="40px">
          <p class="pr-2 ma-0">View:</p>
          <v-card flat style="border: solid 1px #efefef; padding-top: 1px;" height="36px" class="pl-2">
            <v-select solo flat hide-details v-model="selected.value" class="primary body-1" :items="options" item-text="text" item-value="value" height="32px" @click="setSelectedTxs"></v-select>
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Tx Table Header -->
    <block-address-tx-table :transactions='filteredTxs' :account='address' :filter="selectedTx" :total="getTotal">
    </block-address-tx-table>
    <!-- End Tx Table Header -->
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'TableTransactions',
  props: ['address', 'transactions', 'isPending'],
  data() {
    return {
      searchInput: '',
      selected: {
        text: this.$i18n.t('filter.all'),
        value: 0
      },
      options: [
        {
          text: this.$i18n.t('filter.all'),
          value: 0
        },
        {
          text: this.$i18n.t('filter.in'),
          value: 1
        },
        {
          text: this.$i18n.t('filter.out'),
          value: 2
        }
      ],
      inTx: [],
      outTx: [],
      recievedTx: false,
      filtered: this.transactions
    }
  },
  mounted() {
    this.getTxsType()
  },
  methods: {
    getTxsType() {
      console.log('ere')
      let i
      for (i = 0; i < this.transactions.length; i++) {
        if (
          this.transactions[i]
            .getFrom()
            .toString()
            .toLowerCase() === this.address.toLowerCase()
        ) {
          this.outTx.push(this.transactions[i])
        } else {
          this.inTx.push(this.transactions[i])
        }
      }
      this.recievedTx = true
    },
    searching() {
      console.log('searching')
    },
    setSelectedTxs() {
      if (this.transactions) {
        if (!this.recievedTx) {
          this.getTxsType()
        }
        if (this.selectedTx === 0) {
          this.filtered = this.transactions
        }
        if (this.selectedTx === 2) {
          this.filtered = this.outTx
        }
        if (this.selectedTx === 1) {
          this.filtered = this.inTx
        }
      }
    }
  },
  computed: {
    selectedTx() {
      console.log(this.selected.value)
      return this.selected.value
    },
    filteredTxs() {
      return this.filtered
    },
    getTotal() {
      if (this.transactions) {
        if (this.selected.value === 0) {
          return this.transactions.length
        }
        if (this.selected.value === 1) {
          return this.inTx.length
        }
        return this.outTx.length
      }
      return 0
    }
  }
})
</script>

