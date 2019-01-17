<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-list-details :items="blockDetails" :more-items="blockMoreDetails" :details-type="listType" :loading="loading">
          <app-list-title slot="details-title" :list-type="listType" :block-details="blockInfo" />
        </app-list-details>
      </v-flex>
    </v-layout>
    <!-- Mined Block, txs table -->
    <v-layout row wrap justify-start class="mb-4" v-if="!loading">
      <v-flex v-if="txs" xs12>
        <table-txs v-if="txs" :transactions="txs" :frame-txs="true" :page-type="listType" :loading="loading" class="mt-3" />
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
import AppListDetails from '@app/core/components/ui/AppListDetails.vue'
import AppListTitle from '@app/core/components/ui/AppListTitle.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Detail } from '@app/core/components/props'
import ethUnits from 'ethereumjs-units'
import Bn from 'bignumber.js'
import { eth } from '@app/core/helper'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

// TODO: Display error message if block is not valid or doesn't exist

@Component({
  components: {
    AppBreadCrumbs,
    AppListDetails,
    AppListTitle,
    TableTxs
  }
})
export default class PageDetailsBlock extends Vue {
  @Prop({ type: String }) blockRef!: string

  loading = true
  error = false
  listType = 'block'

  block = null
  blockInfo = {
    next: null,
    prev: null
  }

  txs = []
  uncles = []
  details = []
  moreDetails = []
  timestamp = ''

  data() {
    return {
      crumbs: [
        {
          text: this.$i18n.t('title.blocks'),
          disabled: false,
          link: '/blocks'
        },
        {
          text: '',
          disabled: true
        }
      ]
    }
  }

  // Lifecycle
  created() {
    const ref = this.blockRef

    // 1. Check that current block ref is valid one
    if (!eth.isValidHash(ref) && !eth.isValidBlockNumber(ref)) {
      this.error = true
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
  }

  // Methods:
  fetchBlock() {
    const event = eth.isValidHash(this.blockRef) ? Events.getBlock : Events.getBlockByNumber
    const payload = eth.isValidHash(this.blockRef) ? { hash: this.blockRef.replace('0x', '') } : { number: Number(this.blockRef) }

    this.$socket.emit(event, payload, (error, result) => {
      if (error || !result) {
        this.error = true
        return
      }
      this.setBlockInfo(new Block(result))
    })
  }

  setBlockInfo(block: Block) {
    this.block = block

    this.blockInfo.next = this.block.getNumber() + 1
    this.blockInfo.prev = this.block.getNumber() === 0 ? 0 : this.block.getNumber() - 1

    this.crumbs[1].text = this.$i18n.t('title.blockN') + ' ' + this.block.getNumber()

    this.timestamp = block.getTimestamp().toString()
    this.setDetails(this.block)
    this.setMore(this.block)
    this.txs = this.block.getTxs()
    this.uncles = this.block.getUncles()

    this.loading = false
  }

  setDetails(elem: Block) {
    this.details = [
      {
        title: this.$i18n.t('block.height'),
        detail: elem.getNumber()
      },
      {
        title: this.$i18n.t('common.hash'),
        detail: elem.getHash(),
        copy: true
      },
      {
        title: this.$i18n.t('block.miner'),
        detail: elem.getMiner().toString(),
        link: '/address/' + elem.getMiner().toString(),
        copy: true
      },
      {
        title: this.$i18n.t('common.timestmp'),
        detail: this.formatTime
      },
      {
        title: this.$i18n.t('block.reward'),
        detail: elem.getMinerReward().toEthFormated() + ' ' + this.$i18n.t('common.eth')
      },
      {
        title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.uncReward'),
        detail: elem.getUncleReward().toEthFormated() + ' ' + this.$i18n.t('common.eth')
      },
      {
        title: this.$i18n.t('block.pHash'),
        detail: elem.getParentHash().toString(),
        link: '/block/' + elem.getParentHash().toString()
      },
      {
        title: this.$i18n.t('title.tx'),
        detail: elem.getTransactionCount()
      }
    ]
  }

  setMore(elem: Block) {
    this.moreDetails = [
      {
        title: this.$i18n.t('block.diff'),
        detail: elem.getDifficulty().toNumber()
      },
      {
        title: this.$i18n.t('block.totalDiff'),
        detail: elem.getTotalDifficulty().toNumber()
      },
      {
        title: this.$i18n.t('block.nonce'),
        detail: elem.getNonce().toString()
      },
      {
        title: this.$i18n.t('block.root'),
        detail: elem.getStateRoot().toString()
      },
      {
        title: this.$i18n.t('block.data'),
        detail: elem.getExtraData().toString()
      },
      {
        title: this.$i18n.t('block.fees'),
        detail: elem.getTxFees().toEth() + ' ' + this.$i18n.t('common.eth')
      },
      {
        title: this.$i18n.t('gas.limit'),
        detail: elem.getGasLimit().toNumber()
      },
      {
        title: this.$i18n.t('gas.used'),
        detail: elem.getGasUsed().toNumber()
      },
      {
        title: this.$i18n.t('block.logs'),
        detail: elem.getLogsBloom().toString()
      },
      {
        title: this.$i18n.t('block.txRoot'),
        detail: elem.getTransactionsRoot().toString()
      },
      {
        title: this.$i18n.t('block.recRoot'),
        detail: elem.getReceiptsRoot().toString()
      },
      {
        title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.sha'),
        detail: elem.getSha3Uncles().toString()
      }
    ]
  }

  // Computed:

  get nextBlock(): String {
    return '/block/' + this.blockInfo.next
  }

  get previousBlock(): String {
    return '/block/' + this.blockInfo.prev
  }

  get blockDetails(): Detail[] {
    return this.details
  }

  get blockMoreDetails(): Detail[] {
    return this.moreDetails
  }

  get formatTime(): string {
    return new Date(this.timestamp).toString()
  }
}
</script>
