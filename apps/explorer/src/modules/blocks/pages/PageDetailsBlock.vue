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
          :transactions="txsPage"
          :frame-txs="true"
          :page-type="listType"
          :loading="isLoading"
          class="mt-3"
          :max-items="max"
          :total-txs="totalTxs"
          :error="''"
          @getTxsPage="setPageTxs"
        />
        <v-card v-if="txs.length === 0" flat color="white">
          <v-card-text class="text-xs-center text-muted">{{ $t('message.noTxInBlock') }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Block, Uncle, Tx, EthValue } from '@app/core/models'
import { Events } from 'ethvm-common'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AppListDetails from '@app/core/components/ui/AppListDetails.vue'
import AppListTitle from '@app/core/components/ui/AppListTitle.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import BlockDetailsTitle from '@app/modules/blocks/components/BlockDetailsTitle.vue'
import { Detail } from '@app/core/components/props'
import ethUnits from 'ethereumjs-units'
import Bn from 'bignumber.js'
import { eth } from '@app/core/helper'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

const MAX_TXS = 10

@Component({
  components: {
    AppBreadCrumbs,
    AppError,
    AppListDetails,
    AppListTitle,
    TableTxs,
    AppDetailsList,
    BlockDetailsTitle
  }
})
export default class PageDetailsBlock extends Vue {
  @Prop({ type: String }) blockRef!: string

  error = ''
  listType = 'block'

  block = {} as Block
  blockInfo = {
    next: null,
    prev: null,
    mined: false
  }

  txs = []
  totalTxs = 0
  txsPage = []
  uncles = []
  details = []
  moreDetails = []
  timestamp = ''

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    const ref = this.blockRef

    // 1. Check that current block ref is valid one
    if (!eth.isValidHash(ref) && !eth.isValidBlockNumber(ref)) {
      this.error = this.$i18n.t('message.invalidHash').toString()
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
    const start = (page - 1) * this.max
    const end = start + this.max
    this.txsPage = this.txs.slice(start, end)
  }
  fetchBlock() {
    const promise = eth.isValidHash(this.blockRef) ? this.$api.getBlock(this.blockRef) : this.$api.getBlockByNumber(Number(this.blockRef))
    promise
      .then(block => {
        if (block === null) {
          this.error = `${this.$i18n.t('message.invalidBlock').toString()}: ${this.blockRef}`
          return
        }
        this.setBlockInfo(block)
      })
      .catch(err => {
        this.error = `${this.$i18n.t('message.invalidBlock').toString()}: ${this.blockRef}`
      })
  }

  setBlockInfo(block: Block) {
    this.block = block
    this.blockInfo.mined = true
    this.blockInfo.next = this.block.getNumber() + 1
    this.blockInfo.prev = this.block.getNumber() === 0 ? 0 : this.block.getNumber() - 1

    this.timestamp = block.getTimestamp().toString()
    this.txs = this.block.getTxs()
    this.totalTxs = this.block.getTransactionCount()
    this.setPageTxs(1)
    this.uncles = this.block.getUncles()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  get blockDetails(): Detail[] {
    let details
    if (this.isLoading) {
      details = [
        {
          title: this.$i18n.t('block.height')
        },
        {
          title: this.$i18n.t('common.hash')
        },
        {
          title: this.$i18n.t('block.pHash')
        },
        {
          title: this.$i18n.t('block.miner')
        },
        {
          title: this.$i18n.t('common.timestmp')
        },
        {
          title: this.$i18n.t('block.reward')
        },
        {
          title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.uncReward')
        },
        {
          title: this.$i18n.t('title.tx')
        },
        {
          title: this.$i18n.t('block.diff')
        },
        {
          title: this.$i18n.t('block.totalDiff')
        },
        {
          title: this.$i18n.t('block.nonce')
        },
        {
          title: this.$i18n.t('block.root')
        },
        {
          title: this.$i18n.t('block.data')
        },
        {
          title: this.$i18n.t('block.fees')
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
          title: this.$i18n.t('block.txRoot')
        },
        {
          title: this.$i18n.t('block.recRoot')
        },
        {
          title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.sha')
        }
      ]
    } else {
      details = [
        {
          title: this.$i18n.t('block.height'),
          detail: this.block.getNumber()
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: this.block.getHash(),
          copy: true
        },
        {
          title: this.$i18n.t('block.pHash'),
          detail: this.block.getParentHash().toString(),
          link: '/block/' + this.block.getParentHash().toString(),
          copy: true
        },
        {
          title: this.$i18n.t('block.miner'),
          detail: this.block.getMiner().toString(),
          link: '/address/' + this.block.getMiner().toString(),
          copy: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.formatTime
        },
        {
          title: this.$i18n.t('block.reward'),
          detail: this.block.getMinerReward().toEthFormated() + ' ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.uncReward'),
          detail: this.block.getUncleReward().toEthFormated() + ' ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('title.tx'),
          detail: this.block.getTransactionCount()
        },
        {
          title: this.$i18n.t('block.diff'),
          detail: this.block.getDifficulty().toNumber()
        },
        {
          title: this.$i18n.t('block.totalDiff'),
          detail: this.block.getTotalDifficulty().toNumber()
        },
        {
          title: this.$i18n.t('block.nonce'),
          detail: this.block.getNonce().toString()
        },
        {
          title: this.$i18n.t('block.root'),
          detail: this.block.getStateRoot().toString()
        },
        {
          title: this.$i18n.t('block.data'),
          detail: this.block.getExtraData().toString()
        },
        {
          title: this.$i18n.t('block.fees'),
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
          detail: this.block.getLogsBloom().toString()
        },
        {
          title: this.$i18n.t('block.txRoot'),
          detail: this.block.getTransactionsRoot().toString()
        },
        {
          title: this.$i18n.t('block.recRoot'),
          detail: this.block.getReceiptsRoot().toString()
        },
        {
          title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.sha'),
          detail: this.block.getSha3Uncles().toString()
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
        text: this.$i18n.t('title.blocks'),
        disabled: false,
        link: '/blocks'
      },
      {
        text: this.$i18n.t('title.blockN') + ' ' + this.$route.params.blockRef,
        disabled: true
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
