<template>
  <v-container v-if="transaction != null" grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4" v-if="tx">
      <v-flex xs12>
        <app-list-details :items="txDetails" :more-items="txMoreDetails" :details-type="listType" :loading="loading">
          <app-list-title slot="details-title" :list-type="listType" />
        </app-list-details>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppListDetails from '@app/core/components/ui/AppListDetails.vue'
import AppListTitle from '@app/core/components/ui/AppListTitle.vue'
import { Events } from 'ethvm-common'
import { eth } from '@app/core/helper'
import { Tx } from '@app/core/models'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Detail } from '@app/core/components/props'

@Component({
  components: {
    AppBreadCrumbs,
    AppListDetails,
    AppListTitle
  }
})
export default class PageDetailsTxs extends Vue {
  @Prop({ type: String }) txRef!: string

  loading = true
  error = false
  listType = 'tx'

  transaction = null
  details = []
  moreDetails = []
  timestamp = ''

  // Lifecycle
  created() {
    const ref = this.txRef

    // 1. Check that current tx ref is valid one
    if (!eth.isValidHash(ref)) {
      this.error = true
      return
    }

    // 2. Check that we have our tx in the store
    const tx = this.$store.getters.txByHash(ref)

    // 3. Depending on previous state, we display directly or not
    if (tx) {
      this.setTxInfo(tx)
    } else {
      this.fetchTx()
    }
  }

  //Methods:
  fetchTx() {
    this.$socket.emit(
      Events.getTx,
      {
        hash: this.txRef.replace('0x', '')
      },
      (error, data) => {
        if (error || !data) {
          this.error = true
          return
        }
        this.setTxInfo(new Tx(data))
      }
    )
  }

  setTxInfo(tx: Tx) {
    this.transaction = tx
    this.timestamp = this.tx.getTimestamp().toString()
    this.setDetails(this.transaction)
    this.setMore(this.transaction)
    this.loading = false
  }

  setDetails(tx: Tx) {
    this.details = [
      {
        title: this.$i18n.t('common.hash'),
        detail: tx.getHash(),
        copy: true
      },
      {
        title: this.$i18n.t('common.timestmp'),
        detail: this.formatTime
      },
      {
        title: this.$i18n.t('tx.from'),
        detail: tx.getFrom().toString(),
        copy: true,
        link: '/address/' + tx.getFrom().toString()
      },
      {
        title: this.$i18n.t('tx.amount'),
        detail:
          tx
            .getValue()
            .toEthFormated()
            .toString() +
          ' ' +
          this.$i18n.t('common.eth')
      },
      this.getTo(tx)
    ]
  }

  setMore(tx: Tx) {
    this.moreDetails = [
      {
        title: this.$i18n.t('tableHeader.blockN'),
        detail: tx.getBlockNumber(),
        link: '/block/' + tx.getBlockHash().toString()
      },
      {
        title: this.$i18n.t('gas.limit'),
        detail: tx.getGas().toNumber()
      },
      {
        title: this.$i18n.t('gas.used'),
        detail: tx.getGasUsed().toNumber()
      },
      {
        title: this.$i18n.t('gas.price'),
        detail: tx.getGasPrice().toNumber()
      },
      {
        title: this.$i18n.t('tx.cost'),
        detail: this.tx.getTxCost().toWei() + ' ' + this.$i18n.t('common.eth')
      }
    ]
  }

  getTo(tx: Tx) {
    if (!tx.getContractAddress().isEmpty()) {
      return {
        title: this.$i18n.t('tx.to') + ' ' + this.$i18n.t('tx.contract'),
        detail: tx.getContractAddress().toString(),
        copy: true,
        link: '/address/' + tx.getContractAddress().toString()
      }
    }

    return {
      title: this.$i18n.t('tx.to'),
      detail: tx.getTo().toString(),
      copy: true,
      link: '/address/' + tx.getTo().toString()
    }
  }

  // Computed
  get tx(): Tx {
    return this.transaction
  }

  get txDetails(): Detail[] {
    return this.details
  }

  get txMoreDetails(): Detail[] {
    return this.moreDetails
  }

  get formatTime(): string {
    return new Date(this.timestamp).toString()
  }

  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.tx'),
        disabled: <boolean>false,
        link: '/txs'
      },
      {
        text: this.$i18n.t('common.tx') + ': ' + this.txRef,
        disabled: true
      }
    ]
  }
}
</script>
