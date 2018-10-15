<template>
  <v-container v-if="transaction != null" grid-list-lg class="mt-0">
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
        <block-tx-detail :tx="transaction"></block-tx-detail>
      </v-flex>
    </v-layout>
    <!-- Get Sub Tx
      <div v-if>
        <h4>Sub Transactions</h4>
        <block-last-transactions :tx="transactions"></block-last-transactions>
      </div>
      -->
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import chartOptions from '@app/sampleData/chartData.json'
import store from '@app/states'
import Vue from 'vue'
import sEvents from '@app/configs/socketEvents.json'

export default Vue.extend({
  name: 'tx-Detail',
  props: ['txHash'],
  data() {
    return {
      store,
      common,
      transaction: null,
      unixtimestamp: null,
      timestamp: null,
      items: [
        {
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
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
  mounted() {
    /* Get Tx Info */
    this.$socket.emit(
      sEvents.getTx,
      {
        hash: this.txHash.replace('0x', '')
      },
      (err, data) => {
        if (data) {
          this.transaction = new Tx(data)
          /* Method to get Subtransactions: */
        }
      }
    )
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
