<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-details-list :title="title" :details="txDetails" :is-loading="isLoading" :error="error" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { Events } from 'ethvm-common'
import { eth } from '@app/core/helper'
import { Tx } from '@app/core/models'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Detail } from '@app/core/components/props'

@Component({
  components: {
    AppBreadCrumbs,
    AppDetailsList
  }
})
export default class PageDetailsTxs extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: String }) txRef!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  error = ''
  listType = 'tx'
  transaction = {} as Tx
  timestamp = ''

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  created() {
    const ref = this.txRef

    // 1. Check that current tx ref is valid one
    if (!eth.isValidHash(ref)) {
      this.error = this.$i18n.t('message.invalidHash').toString()
      return
    }

    // 2. Check that we have our tx in the store
    const tx = this.$store.getters.txByHash(ref)

    // 3. Depending on previous state, we display directly or not
    if (tx) {
      this.setTxInfo(tx)
    } else {
      this.loadData()
    }

    window.scrollTo(0, 0)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Load all data required for the view.
   */
  loadData() {
    this.loadTx()
  }

  /**
   * Load/fetch all of the data required to display the Tx details component
   * and handle any errors.
   */
  loadTx() {
    this.fetchTx().then(
      res => {
        if (res === null) {
          this.error = this.$i18n.t('message.noTx').toString()
          return
        }
        this.setTxInfo(res)
      },
      err => {
        this.error = this.$i18n.t('message.noTx').toString()
      }
    )
  }

  /**
   * Fetch Tx object via API given a @txRef
   *
   * @return {Promise<Tx>}
   */
  fetchTx(): Promise<Tx> {
    return this.$api.getTx(this.txRef)
  }

  /**
   * Set pertinent Tx information
   */
  setTxInfo(tx: Tx) {
    this.transaction = tx
    this.timestamp = this.tx.getTimestamp().toString()
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Create properly-formatted title from tokenDetails
   *
   * @return {String} - Title for details list
   */
  get title(): string {
    return this.$i18n.t('title.txDetail').toString()
  }

  /**
   * Return transaction details Tx[] object
   *
   * @return {Tx}
   */
  get tx(): Tx {
    return this.transaction
  }

  /**
   * Return properly-formatted Detail for "to" row in list component.
   * If still loading, only return title for placeholder,
   * otherwise determine proper formatting.
   *
   * @return {Detail}
   */
  get toDetail(): Detail {
    // Only include title if still loading (for placeholder) //
    if (this.isLoading) {
      return {
        title: this.$i18n.t('tx.to').toString()
      }
    }

    // If empty, format differently //
    if (!this.tx.getContractAddress().isEmpty()) {
      return {
        title: this.$i18n.t('tx.to') + ' ' + this.$i18n.t('tx.contract').toString(),
        detail: this.tx.getContractAddress().toString(),
        copy: true,
        link: '/address/' + this.tx.getContractAddress().toString()
      }
    }

    return {
      title: this.$i18n.t('tx.to').toString(),
      detail: this.tx.getTo().toString(),
      copy: true,
      link: '/address/' + this.tx.getTo().toString()
    }
  }

  /**
   * Properly format the Details[] array for the details table.
   * If the data hasn't been loaded yet, then only include the titles in the details.
   */
  get txDetails(): Detail[] {
    let details : Detail[]
    if (this.isLoading) {
      details = [
        {
          title: this.$i18n.t('tableHeader.blockN')
        },
        {
          title: this.$i18n.t('common.hash')
        },
        {
          title: this.$i18n.t('common.timestmp')
        },
        {
          title: this.$i18n.t('tx.from')
        },
        {
          title: this.$i18n.t('tx.amount')
        },
        this.toDetail,
        {
          title: this.$i18n.t('gas.limit')
        },
        {
          title: this.$i18n.t('gas.used')
        },
        {
          title: this.$i18n.t('gas.price')
        },
        {
          title: this.$i18n.t('tx.cost')
        }
      ]
    } else {
      details = [
        {
          title: this.$i18n.t('tableHeader.blockN'),
          detail: this.tx.getBlockNumber(),
          link: '/block/' + this.tx.getBlockHash().toString()
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: this.tx.getHash(),
          copy: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.formatTime
        },
        {
          title: this.$i18n.t('tx.from'),
          detail: this.tx.getFrom().toString(),
          copy: true,
          link: '/address/' + this.tx.getFrom().toString()
        },
        {
          title: this.$i18n.t('tx.amount'),
          detail:
            this.tx
              .getValue()
              .toEthFormated()
              .toString() +
            ' ' +
            this.$i18n.t('common.eth')
        },
        this.toDetail,
        {
          title: this.$i18n.t('gas.limit'),
          detail: this.tx.getGas().toNumber()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: this.tx.getGasUsed().toNumber()
        },
        {
          title: this.$i18n.t('gas.price'),
          detail: this.tx.getGasPrice().toGWei() + ' ' + this.$i18n.t('common.gwei')
        },
        {
          title: this.$i18n.t('tx.cost'),
          detail: this.tx.getTxCost().toEth() + ' ' + this.$i18n.t('common.eth')
        }
      ]
    }
    return details
  }

  /**
   * Properly format a timestamp into string
   *
   * @return {String} - Timestamp string
   */
  get formatTime(): string {
    return new Date(this.timestamp).toString()
  }

  /**
   * Returns breadcrumbs entry for this particular view.
   * Required for AppBreadCrumbs
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.tx'),
        disabled: false,
        link: '/txs'
      },
      {
        text: this.$i18n.t('common.tx') + ': ' + this.txRef,
        disabled: true
      }
    ]
  }

  /**
   * Determines whether or not the tx object has been loaded/populated.
   *
   * @return {Boolean}
   */
  get isLoading(): boolean {
    return Object.keys(this.tx).length === 0
  }
}
</script>
