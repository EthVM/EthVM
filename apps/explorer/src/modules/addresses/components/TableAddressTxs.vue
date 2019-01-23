<template>
  <v-card color="white" flat v-if="transactions" class="pt-3 pr-2 pl-2">
    <!-- Tx Header -->
    <v-layout align-center justify-space-between wrap row fill-height>
      <!-- Search Box -->
      <!-- <v-flex d-flex xs12 sm6 md4>
        <v-layout row align-center justify-start fill-height height="40px">
          <v-flex xs7 sm9 md10 pr-0>
            <v-card
              flat
              style="border-top: solid 1px #efefef; border-left: solid 1px #efefef; border-bottom: solid 1px #efefef;"
              height="36px"
              class="pr-3 pl-3 pt-2"
            >
              <input :placeholder="$t('search.addressTx')" v-model="searchInput" class="width: 100%" />
            </v-card>
          </v-flex>
          <v-flex xs7 sm3 md2 pl-0>
            <v-btn depressed outline class="primary--text text-capitalize ml-0 lineGrey" @click="searching">{{ $t('search.title') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-flex> -->
      <!-- End Search Box -->
      <v-spacer />
      <!-- Tx Input Filter -->
      <v-flex d-flex xs12 sm4 md3>
        <v-layout row align-center justify-start fill-height height="40px">
          <v-flex>
            <p class="pr-2 ma-0">{{ $t('filter.view') }}:</p>
          </v-flex>
          <v-flex>
            <v-card flat style="border: solid 1px #efefef; padding-top: 1px;" height="36px" class="pl-2">
              <v-select
                solo
                flat
                hide-details
                v-model="selected.value"
                class="primary body-1"
                :items="options"
                item-text="text"
                item-value="value"
                height="32px"
                @click="setSelectedTxs"
              />
            </v-card>
          </v-flex>
          <!-- End Tx Input Filter -->
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Tx Table Content -->
    <table-address-tx-row v-if="!loading" :transactions="filteredTxs" :account="address" :filter="selectedTx" :total="getTotal" :type="isPending" />
    <app-info-load v-else />
    <!-- End Tx Table Content -->
  </v-card>
</template>

<script lang="ts">
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import TableAddressTxRow from '@app/modules/addresses/components/TableAddressTxRow.vue'
import { Tx } from '@app/core/models'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppInfoLoad,
    TableAddressTxRow
  }
})
export default class TableAddressTxs extends Vue {
  @Prop(String) address!: string
  @Prop(Array) transactions!: Tx[]
  @Prop(Boolean) isPending!: boolean
  @Prop({ type: Boolean, default: true }) loading!: boolean

  searchInput = ''
  inTx = []
  outTx = []
  receivedTxs = false
  filtered = this.transactions

  data() {
    return {
      selected: {
        text: this.$i18n.t('filter.all'),
        value: 0
      }
    }
  }

  mounted() {
    this.getTxsType()
  }

  // Methods
  getTxsType() {
    this.transactions.forEach(tx => {
      const from = tx.getFrom().toString()
      if (from === this.address) {
        this.outTx.push(tx)
      } else {
        this.inTx.push(tx)
      }
    })
    this.receivedTxs = true
  }

  searching() {}

  setSelectedTxs() {
    if (this.transactions) {
      if (!this.receivedTxs) {
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

  // computed
  get selectedTx() {
    return this.selected.value
  }

  get filteredTxs() {
    return this.filtered
  }

  get getTotal() {
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

  get options() {
    return [
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
    ]
  }
}
</script>
