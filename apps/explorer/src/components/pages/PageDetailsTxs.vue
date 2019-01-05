<template>
  <v-container v-if="transaction != null" grid-list-lg class="mb-0">
    <app-bread-crumbs :newItems="items"></app-bread-crumbs>
    <v-layout row wrap justify-start class="mb-4" v-if="getTxs">
      <v-flex xs12>
        <app-list-details :items="getDetails" :more="getMoreDetails"></app-list-details>
      </v-flex>
    </v-layout>
    <!--
      Get Sub Tx
      <div v-if>
        <h4>Sub Transactions</h4>
        <block-last-transactions :tx="transactions"></block-last-transactions>
      </div>
    -->
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tx } from '@app/models'
import { Events as sEvents } from 'ethvm-common'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import AppListDetails from '@app/components/ui/AppListDetails.vue'
import { txDetails } from '@app/components/mixins/mixin-details-txs'

export default Vue.extend({
  name: 'tx-Detail',
  props: ['txHash'],
  components: {
    AppBreadCrumbs,
    AppListDetails
  },
  mixins: [txDetails],
  data() {
    return {
      transaction: null,
      items: [
        {
          text: this.$i18n.t('title.tx'),
          disabled: false,
          link: '/transactions'
        },
        {
          text: this.$i18n.t('common.tx') + ': ' + this.txHash,
          disabled: true
        }
      ]
    }
  },
  created() {
    /* Get Tx Info */
    this.$socket.emit(
      sEvents.getTx,
      {
        hash: this.txHash.replace('0x', '')
      },
      (err, data) => {
        if (data) {
          this.transaction = new Tx(data)
          this.setDetails(this.transaction)
          this.setMore(this.transaction)
          //this.setMore(this.transaction)
          /* Method to get Subtransactions: */
        }
      }
    )
  },
  computed: {
    getTxs() {
      return this.transaction
    }
  }
})
</script>
