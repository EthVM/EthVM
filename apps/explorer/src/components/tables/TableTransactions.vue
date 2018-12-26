<template>
  <v-card color="white" flat class="pt-3 pr-4 pl-4 pb-2">
    <v-layout row wrap align-center pb-1>
      <v-flex xs8>
        <v-card-title class="title font-weight-bold">{{ getTitle }}</v-card-title>
      </v-flex>
      <v-flex xs4 v-if="!frameTxs">
        <v-layout justify-end>
          <v-btn outline color="secondary" class="text-capitalize" to="/transactions">{{ $t('bttn.viewAll') }}</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm8 md5>
          <h5>{{ $t('tableHeader.txN') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm3 md2>
          <h5>{{ $t('common.eth') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('gas.limit') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('common.gwei') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only v-if="!pending" sm1>
          <h5>{{ $t('common.status') }}</h5>
        </v-flex>
        <v-flex v-else hidden-xs-and-up></v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->
    <v-card v-if="transactions.length > 0" flat id="scroll-target" :style="getStyle" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target class="pt-1" style="margin-right: 1px">
        <v-flex xs12>
          <v-card v-for="tx in transactions" class="transparent pb-1" flat v-bind:key="tx.getHash()">
            <table-transactions-row :tx="tx" :isPending="pending" />
            <v-divider></v-divider>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
    <div v-else>
      <v-card class="mt-3 mb-3">
        <v-card-text v-if="!pending" class="text-xs-center text-muted">{{ $t('message.noTxHistory') }}</v-card-text>
        <v-card-text v-else class="text-xs-center text-muted">{{ $t('message.noPending') }}</v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import AppFootnotes from '@app/components/ui/AppFootnotes.vue'
import TableTransactionsRow from '@app/components/tables/TableTransactionsRow.vue'
export default Vue.extend({
  name: 'TableTransactions',
  props: {
    pending: {
      type: Boolean,
      defualt: false
    },
    frameTxs: {
      type: Boolean,
      default: false
    },
    showStyle: {
      type: String,
      default: ''
    },
    tableTitle: {
      type: String,
      default: ''
    },
    transactions: {}
  },
  components: {
    TableTransactionsRow
  },
  data() {
    return {
      footnote: [
        {
          color: 'success',
          text: this.$i18n.t('footnote.success'),
          icon: 'fa-check-circle'
        },
        {
          color: 'warning',
          text: this.$i18n.t('footnote.failed'),
          icon: 'fa fa-times-circle'
        }
      ],
      color: 'grey',
      defaultTitle: this.$i18n.t('title.lastTxs')
    }
  },
  computed: {
    getStyle() {
      return this.showStyle
    },
    getTitle() {
      if (this.tableTitle !== '') {
        return this.tableTitle
      }
      return this.defaultTitle
    }
  }
})
</script>
