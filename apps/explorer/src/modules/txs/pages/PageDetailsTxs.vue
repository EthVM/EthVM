<template>
  <v-container v-if="transaction != null" grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4" v-if="tx">
      <v-flex xs12>
        <app-list-details :items="txDetails" :more-items="txMoreDetails" :details-type="detailsType" :loading="txLoad">
          <app-list-title slot="details-title" :list-type="detailsType" />
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
  @Prop({ type: String }) txHash!: string

  details = []
  moreDetails = []
  timestmp = ''
  txLoad = true
  transaction = null
  detailsType = 'tx'

  data() {
    return {
      crumbs: [
        {
          text: this.$i18n.t('title.tx'),
          disabled: false,
          link: '/txs'
        },
        {
          text: this.$i18n.t('common.tx') + ': ' + this.txHash,
          disabled: true
        }
      ]
    }
  }

  // Lifecycle
  created() {
    /* Get Tx Info */
    this.$socket.emit(
      Events.getTx,
      {
        hash: this.txHash.replace('0x', '')
      },
      (err, data) => {
        if (data) {
          this.transaction = new Tx(data)
          this.setDetails(this.transaction)
          this.setMore(this.transaction)
          this.txLoad = false
        } else {
          this.txLoad = false
        }
      }
    )
  }

  //Methods:
  getStringStatus(isBool: boolean) {
    if (isBool) {
      return 'Successful'
    }
    this.statusColor = 'warning--text'
    return 'Failed'
  }

  getTxCost(price, used) {
    return price * used
  }

  getTo(tx: Tx) {
    if (tx.getContractAddress()) {
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

  setDetails(tx: Tx) {
    this.timestmp = tx.getTimestamp().toString()
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
      }
    ]
    this.details.push(this.getTo(tx))
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
        detail: tx.getGas()
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
        detail: this.getTxCost(tx.getGasPrice().toNumber(), tx.getGasUsed().toNumber()) + ' ' + this.$i18n.t('common.eth')
      }
    ]
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
    return new Date(this.timestmp).toString()
  }
}
</script>
