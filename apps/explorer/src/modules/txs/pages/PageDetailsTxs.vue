<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-details-list :title="title" :details="txDetails" :is-loading="isLoading" :error="error" :max-items="7" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { eth } from '@app/core/helper'
import { Detail, Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { transactionDetail } from '@app/modules/txs/txs.graphql'
import { TransactionDetailExt } from '@app/core/api/apollo/extensions/transaction-detail.ext'

@Component({
  components: {
    AppBreadCrumbs,
    AppDetailsList
  },
  apollo: {
    transactionDetail: {
      query: transactionDetail,
      variables() {
        return { hash: this.txHash }
      },
      fetchPolicy: 'cache-and-network',
      watchLoading(isLoading) {
        if (isLoading) {
          this.error = ''
        } // clear the error on load
      },
      update({ transaction }) {
        if (transaction) {
          return new TransactionDetailExt(transaction)
        }

        this.error = this.error || this.$i18n.t('message.invalid.tx')
        return null
      },
      error({ graphQLErrors, networkError }) {
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      }
    }
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
  transactionDetail?: TransactionDetailExt

  // TODO remove these?
  listType = 'tx'

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  created() {
    // Check that current tx ref is valid one

    if (!this.txHash) {
      this.error = this.$i18n.t('message.invalid.tx').toString()
      return
    }

    window.scrollTo(0, 0)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get txHash(): string | null {
    const { txRef } = this
    return eth.isValidHash(txRef) ? txRef : null
  }

  /**
   * Create properly-formatted title from tokenDetails
   *
   * @return {String} - Title for details list
   */
  get title(): string {
    return this.$i18n.t('tx.detail').toString()
  }

  /*
 ===================================================================================
   Methods
 ===================================================================================
 */

  /**
   * Return properly-formatted Detail for "to" row in list component.
   *
   * @return {Detail}
   */
  toDetail(transaction: TransactionDetailExt): Detail {
    const { receipt } = transaction

    if (receipt && receipt.contractAddress) {
      return {
        title: `${this.$i18n.t('tx.to')} ${this.$i18n.tc('contract.name', 1).toString()}`,
        detail: receipt.contractAddress,
        copy: true,
        link: `/address/${receipt.contractAddress}`,
        mono: true
      }
    }

    return {
      title: this.$i18n.t('tx.to').toString(),
      detail: transaction.to!,
      copy: true,
      link: `/address/${transaction.to!}`,
      mono: true
    }
  }

  /**
   * Properly format the Details[] array for the details table.
   * If the data hasn't been loaded yet, then only include the titles in the details.
   */
  get txDetails(): Detail[] {
    let details: Detail[]
    if (this.isLoading || this.error) {
      details = [
        {
          title: this.$i18n.t('block.number')
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
          title: this.$i18n.t('common.amount')
        },
        {
          title: this.$i18n.t('tx.to').toString()
        },
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
          title: this.$i18n.tc('tx.fee', 1)
        }
      ]
    } else {
      const transaction = this.transactionDetail!
      const receipt = transaction.receipt!

      details = [
        {
          title: this.$i18n.t('block.number'),
          detail: transaction.blockNumberBN.toString(),
          link: `/block/${transaction.blockHash}`
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: transaction.hash,
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.$i18n.d(transaction.timestampMs, 'long', this.$i18n.locale.replace('_', '-'))
        },
        {
          title: this.$i18n.t('tx.from'),
          detail: transaction.from,
          copy: true,
          link: `/address/${transaction.from}`,
          mono: true
        },
        {
          title: this.$i18n.t('common.amount'),
          detail: `${transaction.valueEth.toEthFormatted().toString()} ${this.$i18n.t('common.eth')}`
        },
        this.toDetail(transaction),
        {
          title: this.$i18n.tc('tx.fee', 2),
          detail: `${transaction.feeEth.toEth()} ${this.$i18n.t('common.eth')}`
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: transaction.gasBN.toString()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: receipt.gasUsedBN.toString()
        },
        {
          title: this.$i18n.t('gas.price'),
          detail: `${transaction.gasPriceEth.toGWei()} ${this.$i18n.t('common.gwei')}`
        },
        {
          title: this.$i18n.t('common.nonce'),
          detail: transaction.nonceBN.toString()
        },
        {
          title: this.$i18n.t('tx.input'),
          detail: '',
          txInput: this.inputFormatted
        }
      ]
    }

    return details
  }

  /**
   * Returns breadcrumbs entry for this particular view.
   * Required for AppBreadCrumbs
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbs(): Crumb[] {
    return [
      {
        text: 'tx.mined',
        disabled: false,
        link: '/txs'
      },
      {
        text: 'tx.hash',
        disabled: true,
        plural: 1,
        label: {
          name: `${this.txRef} `,
          hash: true
        }
      }
    ]
  }

  /**
   * Determines whether or not the tx object has been loaded/populated.
   *
   * @return {Boolean}
   */
  get isLoading(): boolean {
    return this.$apollo.loading
  }

  get inputFormatted(): string[] {
    if (!this.transactionDetail) {
      return ['0x']
    }

    const methodId = this.transactionDetail.inputMethodId
    if (!methodId) {
      return ['0x']
    }

    const methodFormatted = `${this.$i18n.t('tx.method')}: ${methodId}`

    const inputFunction = this.transactionDetail.inputFunction

    if (inputFunction) {
      return [`${this.$i18n.t('tx.func')}: ${inputFunction}`, methodFormatted]
    }

    return [methodFormatted]
  }
}
</script>
