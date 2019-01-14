<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-list-details :items="blockDetails" :more-items="blockMoreDetails" :details-type="blockType" :loading="blockLoad">
          <app-list-title slot="details-title" :list-type="blockType" :block-details="blockInfo"></app-list-title>
        </app-list-details>
      </v-flex>
    </v-layout>
    <!-- Mined Block, txs table -->
    <v-layout v-if="blockType == 'block' && blockInfo.mined" row wrap justify-start class="mb-4">
      <v-flex v-if="!txs && !txsLoad" xs12>
        <table-txs v-if="txs" :transactions="txs" :frame-txs="true" :page-type="blockType" :loading="txsLoad" class="mt-3" />
        <v-card v-if="txs && txsLoad" flat color="white">
          <v-card-text class="text-xs-center text-muted">{{ $t('message.noTxInBlock') }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Block, Tx, WeiValue } from '@app/core/models'
import { Events } from 'ethvm-common'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppListDetails from '@app/core/components/ui/AppListDetails.vue'
import AppListTitle from '@app/core/components/ui/AppListTitle.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Detail } from '@app/core/components/props'
import ethUnits from 'ethereumjs-units'
import Bn from 'bignumber.js'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

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

  blockLoad = true
  txsLoad = true

  block = null
  blockN = null
  blockInfo = {
    mined: null,
    next: null,
    prev: null,
    uncles: null
  }
  blockType = 'block'

  txs = []
  details = []
  moreDetails = []
  timestmp = ''

  data() {
    return {
      items: [
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
  /* Lifecycle: */
  created() {
    /* Case 1:  No Data in store --> need data for last block in case curr block was not mined*/
    if (this.$store.getters.blocks.length === 0) {
      this.getBlocks()
    }
  }

  mounted() {
    /* Case 2:  Data in store*/
    if (this.blockRef) {
      this.checkBlockRef() ? this.getBlockByHash() : this.getBlockByNumber()
    }
    if (this.blockN) {
      this.items[1].text = this.$i18n.t('title.blockN') + ' ' + this.blockN
    }

    /* Block was not mined --> wait to be mined */
    this.$eventHub.$on(Events.newBlock, _block => {
      if (this.$store.getters.blocks.length > 0) {
        const lastMinedBlock = this.$store.getters.blocks[0]
        console
        if (lastMinedBlock.getNumber() == Number(this.blockRef) || lastMinedBlock.getHash() == this.blockRef) {
          this.block = lastMinedBlock
          this.blockInfo.mined = true
          this.setBlock()
          this.stopBlockCheck()
        }
      }
    })
  }

  beforeDestroy() {
    this.stopBlockCheck()
  }

  // Methods:
  stopBlockCheck() {
    this.$eventHub.$off(Events.newBlock)
  }

  getBlocks() {
    this.$socket.emit(
      Events.pastBlocks,
      {
        limit: 1,
        page: 0
      },
      (err, blocks) => {
        this.$store.commit(Events.newBlock, blocks)
        if (blocks && blocks.length > 0) {
          this.$eventHub.$emit(Events.pastBlocksR)
          this.$eventHub.$emit(Events.newBlock, new Block(blocks[0]))
        }
      }
    )
  }

  getBlockByHash() {
    this.$socket.emit(
      Events.getBlock,
      {
        hash: this.blockRef.replace('0x', '')
      },
      (error, result) => {
        if (result) {
          this.setRawBlock(result)
        } else {
          this.blockInfo.mined = false
          //block does not exist and since prop is hash, there is now way to find previous reference --> Error This Block Does not exist
        }
      }
    )
  }

  getBlockByNumber() {
    this.blockN = Number(this.blockRef)
    this.$socket.emit(
      Events.getBlockByNumber,
      {
        number: Number(this.blockRef)
      },
      (error, result) => {
        if (result) {
          this.setRawBlock(result)
        } else {
          this.blockInfo.mined = false
        }
      }
    )
  }

  checkBlockRef(): boolean {
    return this.blockRef.includes('0x')
  }

  setRawBlock(result) {
    this.block = new Block(result)
    this.blockLoad = false
    this.blockInfo.mined = true
    this.setBlock()
  }

  setBlock() {
    this.blockInfo.uncles = this.block.getUncles()
    this.blockInfo.next = this.nextBlock
    this.blockInfo.prev = this.previousBlock
    this.setDetails(this.block)
    this.setMore(this.block)

    if (this.block.getIsUncle()) {
      this.blockType = 'uncle'
    } else {
      this.$socket.emit(
        Events.getBlockTransactions,
        {
          hash: this.block.getHash().replace('0x', '')
        },
        (err, data) => {
          this.txsLoad = false
          this.txs = data.map(_tx => {
            return new Tx(_tx)
          })
        }
      )
    }
  }

  setDetails(block: Block) {
    this.timestmp = block.getTimestamp().toString()

    this.details = [
      {
        title: this.$i18n.t('block.height'),
        detail: block.getNumber()
      },
      {
        title: this.$i18n.t('common.hash'),
        detail: block.getHash(),
        copy: true
      },
      {
        title: this.$i18n.t('block.miner'),
        detail: block.getMiner(),
        link: '/address/' + block.getMiner(),
        copy: true
      },
      {
        title: this.$i18n.t('common.timestmp'),
        detail: this.formatTime
      },
      {
        title: this.$i18n.t('block.reward'),
        detail: new WeiValue(block.getMinerReward()).toEthFormated() + '  ' + this.$i18n.t('common.eth')
      },
      {
        title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.uncReward'),
        detail: new WeiValue(block.getUncleReward()).toEthFormated() + ' ' + this.$i18n.t('common.eth')
      },
      {
        title: this.$i18n.t('block.pHash'),
        detail: block.getParentHash(),
        link: '/block/' + block.getParentHash()
      }
    ]

    if (block.getIsUncle()) {
      const item = {
        title: this.$i18n.t('title.position'),
        detail: block.getPosition()
      }
      this.details.push(item)
    } else {
      const item = {
        title: this.$i18n.t('title.tx'),
        detail: block.getTransactionCount()
      }
      this.details.push(item)
    }
  }

  setMore(block: Block) {
    this.moreDetails = [
      {
        title: this.$i18n.t('block.diff'),
        detail: block.getDifficulty()
      },
      {
        title: this.$i18n.t('block.totalDiff'),
        detail: block.getTotalDifficulty()
      },
      {
        title: this.$i18n.t('block.nonce'),
        detail: block.getNonce()
      },
      {
        title: this.$i18n.t('block.root'),
        detail: block.getStateRoot().toString()
      },
      {
        title: this.$i18n.t('block.data'),
        detail: block.getExtraData().toString()
      }
    ]

    if (!block.getIsUncle()) {
      const newItems = [
        {
          title: this.$i18n.t('block.fees'),
          detail: ethUnits.convert(new Bn(block.getTxFees()), 'wei', 'eth') + ' ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: block.getGasLimit()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: block.getGasUsed()
        },
        {
          title: this.$i18n.t('block.logs'),
          detail: block.getLogsBloom().toString()
        },
        {
          title: this.$i18n.t('block.txRoot'),
          detail: block.getTransactionsRoot().toString()
        },
        {
          title: this.$i18n.t('block.recRoot'),
          detail: block.getReceiptsRoot().toString()
        },
        {
          title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.sha'),
          detail: block.getSha3Uncles()
        }
      ]
      newItems.forEach(i => {
        this.moreDetails.push(i)
      })
    }
  }

  /* Computed: */

  get nextBlock(): String {
    return '/block/' + (this.blockN + 1).toString
  }

  get previousBlock(): String {
    return '/block/' + (this.blockN - 1).toString
  }

  get blockDetails(): Detail[] {
    return this.details
  }

  get blockMoreDetails(): Detail[] {
    return this.moreDetails
  }

  get formatTime(): string {
    return new Date(this.timestmp).toString()
  }
}
</script>
