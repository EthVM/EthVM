<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <!--
    =====================================================================================
      DETAILS LIST
    =====================================================================================
    -->
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-details-list :details="blockDetails" :is-loading="loading" class="mb-4" :error="error" :max-items="8">
          <template v-slot:title>
            <block-details-title :next-block="nextBlock" :prev-block="previousBlock" :uncles="uncleHashes" />
            <v-divider class="lineGrey" />
          </template>
        </app-details-list>
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      TX TABLE
    =====================================================================================
    -->
    <v-layout row wrap justify-start class="mb-4" v-if="!hasError">
      <v-flex xs12>
        <table-txs :block-number="blockNumber" :block-hash="blockHash" :page-type="'block'" class="mt-3" :max-items="max" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import BlockDetailsTitle from '@app/modules/blocks/components/BlockDetailsTitle.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Detail, Crumb } from '@app/core/components/props'
import { eth } from '@app/core/helper'
import { Vue, Component, Prop } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import { blockByNumber, blockByHash } from '@app/modules/blocks/blocks.graphql'
import { BlockDetailExt } from '@app/core/api/apollo/extensions/block-detail.ext'

const MAX_TXS = 10

@Component({
  components: {
    AppBreadCrumbs,
    AppDetailsList,
    BlockDetailsTitle,
    TableTxs
  },
  data() {
    return {
      syncing: undefined
    }
  },
  apollo: {
    blockDetail: {
      query() {
        const self = this as any

        if (self.blockNumber) {
          return blockByNumber
        } else if (self.blockHash) {
          return blockByHash
        }
        return null
      },

      fetchPolicy: 'cache-and-network',

      variables() {
        const { blockNumber, blockHash } = this
        if (blockNumber) {
          return { blockNumber }
        }
        return { blockHash }
      },

      update({ blockDetail }) {
        if (blockDetail) {
          return new BlockDetailExt(blockDetail)
        } else if (!this.syncing) {
          this.error = this.error || this.$i18n.t('message.invalid.block')
        }

        return null
      },

      error({ graphQLErrors, networkError }) {
        const self = this

        if (graphQLErrors) {
          graphQLErrors.forEach(error => {
            switch (error.message) {
              case 'Currently syncing':
                // TODO handle this better with custom code or something
                self.syncing = true
                break
              default:
              // Do nothing
            }
          })
        }
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      }
    }
  }
})
export default class PageDetailsBlock extends Vue {
  /*
    ===================================================================================
      Props
    ===================================================================================
    */

  @Prop({ type: String }) blockRef!: string

  /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

  blockDetail?: BlockDetailExt
  error = ''
  syncing: undefined

  /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

  created() {
    // Check that current block ref is valid one

    if (!(this.blockNumber || this.blockHash)) {
      this.error = this.$i18n.t('message.invalid.block').toString()
      return
    }

    window.scrollTo(0, 0)
  }

  /*
    ===================================================================================
      Methods
    ===================================================================================
    */

  /*
    ===================================================================================
      Computed
    ===================================================================================
    */

  get loading(): boolean | undefined {
    return this.$apollo.loading || this.syncing
  }

  get uncleHashes(): (string | null)[] {
    const { blockDetail } = this
    return blockDetail ? blockDetail.uncleHashes! : []
  }

  get blockNumber(): BigNumber | null {
    const { blockRef } = this
    return !eth.isValidHash(blockRef) && eth.isValidBlockNumber(blockRef) ? new BigNumber(blockRef) : null
  }

  get blockHash(): string | null {
    const { blockRef } = this
    return eth.isValidHash(blockRef) ? blockRef : null
  }

  get blockDetails(): Detail[] {
    let details: Detail[]

    if (this.$apollo.loading || this.error) {
      details = [
        {
          title: this.$i18n.t('common.height')
        },
        {
          title: this.$i18n.t('common.hash')
        },
        {
          title: this.$i18n.t('block.p-hash')
        },
        {
          title: this.$i18n.t('miner.name')
        },
        {
          title: this.$i18n.t('common.timestmp')
        },
        {
          title: this.$i18n.t('miner.reward')
        },
        {
          title: this.$i18n.t('uncle.reward')
        },
        {
          title: this.$i18n.tc('tx.name', 2)
        },
        {
          title: this.$i18n.t('diff.name')
        },
        {
          title: this.$i18n.t('diff.total')
        },
        {
          title: this.$i18n.t('common.size')
        },
        {
          title: this.$i18n.t('common.nonce')
        },
        {
          title: this.$i18n.t('block.state-root')
        },
        {
          title: this.$i18n.t('block.data')
        },
        {
          title: this.$i18n.tc('tx.fee', 2)
        },
        {
          title: this.$i18n.t('gas.limit')
        },
        {
          title: this.$i18n.t('gas.used')
        },
        {
          title: this.$i18n.t('block.logs')
        },
        {
          title: this.$i18n.t('tx.root')
        },
        {
          title: this.$i18n.t('block.rcpt-root')
        },
        {
          title: `${this.$i18n.tc('uncle.name', 2)} ${this.$i18n.t('common.sha')}`
        }
      ]
    } else {
      const blockDetail = this.blockDetail!
      const header = blockDetail.header!

      details = [
        {
          title: this.$i18n.t('common.height'),
          detail: header.number
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: header.hash!,
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('block.p-hash'),
          detail: header.parentHash!,
          link: `/block/${header.parentHash!}`,
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('miner.name'),
          detail: header.author!,
          link: `/address/${header.author!}`,
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('miner.reward'),
          detail: `${blockDetail.minerRewardFormatted.value} ${this.$i18n.t('common.eth')}`
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.$i18n.d(header.timestampMs!, 'long', this.$i18n.locale.replace('_', '-'))
        },
        {
          title: this.$i18n.t('uncle.reward'),
          detail: `${blockDetail.uncleRewardFormatted.value} ${this.$i18n.t('common.eth')}`
        },
        {
          title: this.$i18n.tc('tx.name', 2),
          detail: blockDetail.transactionCount!
        },
        {
          title: this.$i18n.t('diff.name'),
          detail: header.difficulty
        },
        {
          title: this.$i18n.t('diff.total'),
          detail: header.totalDifficulty
        },
        {
          title: this.$i18n.t('common.size'),
          detail: `${header.size!.toString()} ${this.$i18n.t('block.bytes')}`
        },
        {
          title: this.$i18n.t('common.nonce'),
          detail: header.nonce,
          mono: true
        },
        {
          title: this.$i18n.t('block.state-root'),
          detail: header.stateRoot!.toString(),
          mono: true
        },
        {
          title: this.$i18n.t('block.data'),
          detail: header.extraData!.toString(),
          mono: true
        },
        {
          title: this.$i18n.tc('tx.fee', 2),
          detail: `${blockDetail.totalTxFeesFormatted.value} ${this.$i18n.t('common.eth')}`
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: header.gasLimitBN.toFormat()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: header.gasUsedBN.toFormat()
        },
        {
          title: this.$i18n.t('block.logs'),
          detail: header.logsBloom!,
          mono: true
        },
        {
          title: this.$i18n.t('tx.root'),
          detail: header.transactionsRoot!,
          mono: true
        },
        {
          title: this.$i18n.t('block.rcpt-root'),
          detail: header.receiptsRoot!,
          mono: true
        },
        {
          title: `${this.$i18n.tc('uncle.name', 2)} ${this.$i18n.t('common.sha')}`,
          detail: header.sha3Uncles!,
          mono: true
        }
      ]
    }
    return details
  }

  get nextBlock(): String {
    const { blockNumber, blockHash, blockDetail } = this

    let number: BigNumber | null = null

    if (blockNumber) {
      number = blockNumber
    } else if (blockHash && blockDetail) {
      number = blockDetail.header.numberBN
    }

    if (number) {
      return `/block/${number.plus(1)}`
    }
    return ''
  }

  get previousBlock(): string {
    const { blockNumber, blockHash, blockDetail } = this

    let number: BigNumber | null = null

    if (blockNumber) {
      number = blockNumber
    } else if (blockHash && blockDetail) {
      number = blockDetail.header!.numberBN!
    }

    if (number && number.isGreaterThan(0)) {
      return `/block/${number.minus(1)}`
    }
    return ''
  }

  /**
   * Returns breadcrumbs entry for this particular view.
   * Required for AppBreadCrumbs
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbs(): Crumb[] {
    const crumbs: Crumb[] = [
      {
        text: this.$tc('block.name', 2),
        link: '/blocks'
      }
    ]
    if (!eth.isValidHash(this.blockRef) && !eth.isValidBlockNumber(this.blockRef)) {
      crumbs.push({
        text: this.$tc('block.name', 1)
      })
      return crumbs
    } else if (eth.isValidHash(this.blockRef)) {
      crumbs.push({
        text: this.$t('block.number'),
        hash: this.$route.params.blockRef
      })
      return crumbs
    }
    crumbs.push({
      text: `${this.$t('block.number')} ${this.$route.params.blockRef}`
    })
    return crumbs
  }

  get max(): number {
    return MAX_TXS
  }

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasError(): boolean {
    return this.error !== ''
  }
}
</script>
