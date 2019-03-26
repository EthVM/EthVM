<template>
  <v-container grid-list-lg class="mb-0">
    {{ $d(new Date(), 'short') }}
    <!--
    =====================================================================================
      DETAILS LIST
    =====================================================================================
    -->
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-details-list :details="blockDetails" :is-loading="isLoading" class="mb-4" :error="error" :max-items="8">
          <template v-slot:title>
            <block-details-title :next-block="nextBlock" :prev-block="previousBlock" :uncles="uncles" />
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
      <v-flex v-if="txs" xs12>
        <table-txs
          v-if="txs"
          :transactions="txsFiltered"
          :page="txsPage"
          :page-type="listType"
          :loading="isLoading"
          class="mt-3"
          :max-items="max"
          :total-txs="totalTxs"
          :error="''"
          @getTxsPage="setPageTxs"
        />
        <v-card v-if="txs.length === 0" flat color="white">
          <v-card-text class="text-xs-center text-muted">{{ $t('message.tx.no-in-block') }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Block, Uncle, SimpleTx } from '@app/core/models'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import BlockDetailsTitle from '@app/modules/blocks/components/BlockDetailsTitle.vue'
import { Detail, Crumb } from '@app/core/components/props'
import { eth } from '@app/core/helper'
import { Vue, Component, Prop } from 'vue-property-decorator'

const MAX_TXS = 10

@Component({
  components: {
    AppBreadCrumbs,
    TableTxs,
    AppDetailsList,
    BlockDetailsTitle
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

  error = ''
  listType = 'block'

  block = {} as Block
  blockInfo = {
    next: null,
    prev: null,
    mined: false
  }

  txs:  SimpleTx[] = []
  totalTxs = 0
  txsPage = 0
  uncles = []
  timestamp = new Date()

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    const ref = this.blockRef

    // 1. Check that current block ref is valid one
    if (!eth.isValidHash(ref) && !eth.isValidBlockNumber(ref)) {
      this.error = this.$i18n.t('message.invalid.block').toString()
      return
    }

    // 2. Check that we have our block in the store
    const block = eth.isValidHash(ref) ? this.$store.getters.blockByHash(ref) : this.$store.getters.blockByNumber(Number(ref))

    // 3. Depending on previous state, we display directly or not
    if (block) {
      this.setBlockInfo(block)
    } else {
      this.fetchBlock()
    }

    window.scrollTo(0, 0)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setPageTxs(page: number): void {
    this.txsPage = page
  }

  fetchBlock() {
    const promise = eth.isValidHash(this.blockRef) ? this.$api.getBlock(this.blockRef) : this.$api.getBlockByNumber(Number(this.blockRef))
    promise
      .then(block => {
        if (block === null) {
          this.error = `${this.$i18n.t('message.invalid.block').toString()}: ${this.blockRef}`
          return
        }
        this.setBlockInfo(block)
      })
      .catch(err => {
        this.error = `${this.$i18n.t('message.invalid.block').toString()}: ${this.blockRef}`
      })
  }

  setBlockInfo(block: Block) {
    this.block = block
    this.blockInfo.mined = true
    this.blockInfo.next = this.block.getNumber() + 1
    this.blockInfo.prev = this.block.getNumber() === 0 ? 0 : this.block.getNumber() - 1

    this.timestamp = block.getTimestamp()
    this.txs = this.block.getTxs()
    this.totalTxs = this.block.getTransactionCount()
    this.uncles = this.block.getUncles()
  }

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get blockDetails(): Detail[] {
    let details: Detail[]
    if (this.isLoading) {
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
          title: this.$i18n.tc('uncle.name', 2) + ' ' + this.$i18n.t('common.sha')
        }
      ]
    } else {
      details = [
        {
          title: this.$i18n.t('common.height'),
          detail: this.block.getNumber()
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: this.block.getHash(),
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('block.p-hash'),
          detail: this.block.getParentHash().toString(),
          link: '/block/' + this.block.getParentHash().toString(),
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('miner.name'),
          detail: this.block.getMiner().toString(),
          link: '/address/' + this.block.getMiner().toString(),
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('miner.reward'),
          detail: this.block.getMinerReward().toEth() + ' ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.$i18n.d(this.timestamp, 'long', this.$i18n.locale.replace('_', '-'))
        },
        {
          title: this.$i18n.t('uncle.reward'),
          detail: this.block.getUncleReward().toEth() + ' ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.tc('tx.name', 2),
          detail: this.block.getTransactionCount()
        },
        {
          title: this.$i18n.t('diff.name'),
          detail: this.block.getDifficulty().toNumber()
        },
        {
          title: this.$i18n.t('diff.total'),
          detail: this.block.getTotalDifficulty().toNumber()
        },
        {
          title: this.$i18n.t('common.size'),
          detail: this.block.getSize().toString() + ' ' + this.$i18n.t('block.bytes')
        },
        {
          title: this.$i18n.t('common.nonce'),
          detail: this.block.getNonce().toString(),
          mono: true
        },
        {
          title: this.$i18n.t('block.state-root'),
          detail: this.block.getStateRoot().toString(),
          mono: true
        },
        {
          title: this.$i18n.t('block.data'),
          detail: this.block.getExtraData().toString(),
          mono: true
        },
        {
          title: this.$i18n.tc('tx.fee', 2),
          detail: this.block.getTxFees().toEth() + ' ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: this.block.getGasLimit().toNumber()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: this.block.getGasUsed().toNumber()
        },
        {
          title: this.$i18n.t('block.logs'),
          detail: this.block.getLogsBloom().toString(),
          mono: true
        },
        {
          title: this.$i18n.t('tx.root'),
          detail: this.block.getTransactionsRoot().toString(),
          mono: true
        },
        {
          title: this.$i18n.t('block.rcpt-root'),
          detail: this.block.getReceiptsRoot().toString(),
          mono: true
        },
        {
          title: this.$i18n.tc('uncle.name', 2) + ' ' + this.$i18n.t('common.sha'),
          detail: this.block.getSha3Uncles().toString(),
          mono: true
        }
      ]
    }
    return details
  }

  get nextBlock(): String {
    if (this.blockInfo.mined) {
      return '/block/' + this.blockInfo.next
    }

    if (!this.$route.params.blockRef.includes('0x')) {
      const next = Number(this.$route.params.blockRef) + 1
      return '/block/' + next
    }
    return ''
  }

  get previousBlock(): String {
    if (this.blockInfo.mined) {
      return '/block/' + this.blockInfo.prev
    }

    if (!this.$route.params.blockRef.includes('0x')) {
      const prev = Number(this.$route.params.blockRef) - 1
      return '/block/' + prev
    }
    return ''
  }

  get txsFiltered(): SimpleTx[] {
    const start = this.txsPage * this.max
    const end = start + this.max
    return this.txs.slice(start, end)
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
        text: 'block.name',
        disabled: false,
        link: '/blocks',
        plural: 2
      },
      {
        text: 'block.number',
        disabled: true,
        label: ` ${this.$route.params.blockRef}`
      }
    ]
  }

  get max(): number {
    return MAX_TXS
  }

  /**
   * Determines whether or not the block object has been loaded/populated.
   *
   * @return {Boolean}
   */
  get isLoading(): boolean {
    return Object.keys(this.block).length === 0
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
