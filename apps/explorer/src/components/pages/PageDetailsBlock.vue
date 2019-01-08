<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="getItems"></app-bread-crumbs>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-list-details :items="blockDetails" :more-items="blockMoreDetails" :details-type="getBlockType">
          <app-list-title slot="details-title" :list-type="getBlockType" :block-details="blockTitle"></app-list-title>
        </app-list-details>
      </v-flex>
    </v-layout>
    <!-- Mined Block, txs table -->
    <v-layout row wrap justify-start class="mb-4">
      <v-flex v-if="blockType == 'block'" xs12>
        <table-txs v-if="transactions" :transactions="transactions" :frame-txs="true" :page-type="blockType" class="mt-3"></table-txs>
        <v-card v-else flat color="white">
          <v-layout v-if="transactionLoading" column align-center justify-center pa-4>
            <v-icon class="text-xs-center fa fa-spinner fa-pulse fa-4x fa-fw primary--text" large></v-icon>
            <v-card-text class="text-xs-center text-muted">{{ $t('message.loadingBlockTx') }}</v-card-text>
          </v-layout>
          <v-card-text v-else class="text-xs-center text-muted">{{ $t('message.noTxInBlock') }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import { Events } from 'ethvm-common'
import store from '@app/states'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import TableTxs from '@app/components/tables/TableTxs.vue'
import AppListDetails from '@app/components/ui/AppListDetails.vue'
import AppListTitle from '@app/components/ui/AppListTitle.vue'
import { BlockDetailsMixin } from '@app/components/mixins/mixin-details-block'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    AppBreadCrumbs,
    AppListDetails,
    AppListTitle,
    TableTxs
  }
})
export default class PageDetailsBlock extends Mixins(BlockDetailsMixin) {
  @Prop({ type: String }) blockRef!: string

  data() {
    return {
      common,
      store,
      block: null,
      blockNumber: null,
      transactions: null,
      transactionLoading: Boolean,
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
      ],
      blockInfo: {
        mined: null,
        next: null,
        prev: null,
        uncles: null
      },
      blockType: 'block'
    }
  }

  // Lifecycle:
  mounted() {
    this.getBlock()
    if (this.$store.getters.getBlocks.length > 0) {
      const lastMinedBlock = this.$store.getters.getBlocks[0]
      if (lastMinedBlock.getNumber() >= this.blockNumber) {
        this.blockInfo.mined = true
        this.getBlock()
      } else {
        this.blockInfo.mined = false
      }
    }

    this.$eventHub.$on(Events.newBlock, _block => {
      this.blockInfo
      if (this.$store.getters.getBlocks.length > 0) {
        const lastMinedBlock = this.$store.getters.getBlocks[0]
        if (lastMinedBlock.getNumber() == Number(this.blockRef) || lastMinedBlock.getHash() == this.blockRef) {
          this.block = lastMinedBlock
          this.setBlock()
        }
      }
    })
  }

  // Methods:
  getBlock() {
    if (this.blockRef.includes('0x')) {
      this.$socket.emit(
        Events.getBlock,
        {
          hash: this.blockRef.replace('0x', '')
        },
        (error, result) => {
          if (result) {
            this.setRawBlock(result)
          } else {
            //block does not exhist and since prop is hash, there is now way to find previous reference --> Error This Block Does not exhist
          }
        }
      )
    } else {
      this.blockNumber = Number(this.blockRef)
      if (this.$store.getters.getBlocks.length > 0) {
        const lastMinedBlock = this.$store.getters.getBlocks[0]
        if (lastMinedBlock.getNumber() >= this.blockNumber) {
          this.$socket.emit(
            Events.getBlockByNumber,
            {
              number: Number(this.blockRef)
            },
            (error, result) => {
              if (result) {
                this.setRawBlock(result)
              }
            }
          )
        } else {
          this.blockInfo.mined = false
          this.blockInfo.prev = this.previousBlock()
        }
      }
    }
  }

  setRawBlock(result) {
    this.block = new Block(result)
    this.setBlock()
  }

  setBlock() {
    this.blockInfo.uncles = this.block.getUncles()
    this.blockInfo.mined = true
    this.blockInfo.next = this.nextBlock()
    this.blockInfo.prev = this.previousBlock()
    this.setDetails(this.block)
    this.setMore(this.block)
    if (!this.blockNumber) {
      this.blockNumber = this.block.getNumber()
    }
    if (this.block.getIsUncle()) {
      this.blockType = 'uncle'
    } else {
      this.transactionLoading = true
      this.$socket.emit(
        Events.getBlockTransactions,
        {
          hash: this.block.getHash().replace('0x', '')
        },
        (err, data) => {
          this.transactionLoading = false
          this.transactions = data.map(_tx => {
            return new Tx(_tx)
          })
        }
      )
    }
  }

  nextBlock(): String {
    const next = this.block.getNumber() + 1
    return '/block/' + next.toString()
  }

  previousBlock(): String {
    return this.block ? '/block/' + (this.block.getNumber() - 1).toString() : '/block/' + this.prev.toString()
  }

  // Computed:
  get getItems() {
    if (this.blockNumber) {
      this.items[1].text = this.$i18n.t('title.blockN') + ' ' + this.blockNumber
    }
    return this.items
  }

  get blockTitle() {
    return this.blockInfo
  }

  get getBlockType() {
    return this.blockType
  }

  get isMined() {
    return this.blockInfo.mined
  }
}
</script>
