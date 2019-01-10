<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-list-details :items="blockDetails" :more-items="blockMoreDetails" :details-type="blockType" :loading="blockLoading">
          <app-list-title slot="details-title" :list-type="blockType" :block-details="blockInfo"></app-list-title>
        </app-list-details>
      </v-flex>
    </v-layout>
    <!-- Mined Block, txs table -->
    <v-layout v-if="blockType == 'block' && blockInfo.mined" row wrap justify-start class="mb-4">
      <v-flex v-if="!txs && !txsLoading" xs12>
        <table-txs v-if="txs" :transactions="txs" :frame-txs="true" :page-type="blockType" :loading="txsLoading" class="mt-3" />
        <v-card v-if="txs && txsLoading" flat color="white">
          <v-card-text class="text-xs-center text-muted">{{ $t('message.noTxInBlock') }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Block, Tx } from '@app/models'
import { Events } from 'ethvm-common'
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

  blockLoading = true
  txsLoading = true

  blockType = 'block'
  block = null
  blockN = null
  blockInfo = {
    mined: null,
    next: null,
    prev: null,
    uncles: null
  }

  txs = null

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
    /* Case 1:  No Data in store --> need data for last block in case curr block was not mined */
    if (this.$store.getters.getBlocks.length === 0) {
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
      if (this.$store.getters.getBlocks.length > 0) {
        const lastMinedBlock = this.$store.getters.getBlocks[0]
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
      Events.getBlocks,
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
    this.blockLoading = false
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
        Events.getBlockTxs,
        {
          hash: this.block.getHash().replace('0x', '')
        },
        (err, data) => {
          this.txsLoading = false
          this.txs = data.map(_tx => {
            return new Tx(_tx)
          })
        }
      )
    }
  }

  /* Computed: */

  get nextBlock(): String {
    return '/block/' + (this.blockN + 1).toString
  }

  get previousBlock(): String {
    return '/block/' + (this.blockN - 1).toString
  }
}
</script>
