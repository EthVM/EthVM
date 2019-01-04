<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :newItems="getItems"></app-bread-crumbs>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex v-if="blockMined" xs12> <app-detail :block="block" :uncles="uncles" :isNotMinedBlock="isNotMinedBlock" :isMined="true"></app-detail> </v-flex>
      <v-flex v-else xs12> <app-detail :isMined="false" :isNotMinedBlock="isNotMinedBlock" :prev="getPrev()"></app-detail> </v-flex>
    </v-layout>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex v-if="blockMined" xs12>
        <table-transactions
          v-if="transactions.length > 0"
          :transactions="transactions"
          :frameTxs="true"
          :tableTitle="$t('title.blockTx')"
          class="mt-3"
        ></table-transactions>
        <v-card v-else flat color="white">
          <v-layout column align-center justify-center ma-3>
            <v-icon v-if="transactionLoading" class="text-xs-center fa fa-spinner fa-pulse fa-4x fa-fw primary--text" large></v-icon>
            <v-card-text v-if="transactionLoading" class="text-xs-center text-muted">{{ $t('block.loadingBlockTx') }}</v-card-text>
            <v-card-text v-else class="text-xs-center text-muted">{{ $t('message.noTxInBlock') }}</v-card-text>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import { Events as sEvents } from 'ethvm-common'
import store from '@app/states'
import Vue from 'vue'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import TableTransactions from '@app/components/tables/TableTransactions.vue'
import AppDetails from '@app/components/ui/AppDetails.vue'
export default Vue.extend({
  name: 'Block',
  props: {
    blockRef: {
      type: String
    }
  },
  components: {
    AppBreadCrumbs,
    TableTransactions,
    AppDetails
  },
  data() {
    return {
      common,
      store,
      block: null,
      bNum: null,
      uncles: [],
      unixtimestamp: null,
      timestamp: null,
      transactions: [],
      transactionLoading: Boolean,
      isNotMinedBlock: false,
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
      details: []
    }
  },
  methods: {
    setRawBlock(result) {
      this.block = new Block(result)
      this.setBlock()
    },
    setBlock() {
      this.uncles = this.block.getUncles()
      if (!this.bNum) {
        this.bNum = this.block.getNumber()
      }
      this.$socket.emit(
        sEvents.getBlockTransactions,
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
    },
    getPrev() {
      return this.bNum - 1
    }
  },
  computed: {
    getItems() {
      if (this.bNum) {
        this.items[1].text = this.$i18n.t('title.blockN') + ' ' + this.bNum
      }
      return this.items
    },
    isUncle() {
      if (this.block && this.block.getIsUncle()) {
        return true
      }
      return false
    },
    blockMined() {
      return this.block
    }
  },
  mounted() {
    this.transactionLoading = true
    /* Get Block Data: */
    if (this.$store.getters.getBlocks.length > 0) {
      this.lastMinedBlock = this.$store.getters.getBlocks[0]
      if (Number(this.lastMinedBlock.block.number) < Number(this.blockRef)) {
        this.isNotMinedBlock = true
      }
    }
    this.$eventHub.$on(sEvents.newBlock, _block => {
      if (this.$store.getters.getBlocks.length > 0) {
        this.lastMinedBlock = this.$store.getters.getBlocks[0]
        if (Number(this.lastMinedBlock.block.number) == Number(this.blockRef)) {
          this.$socket.emit(
            sEvents.getBlockByNumber,
            {
              number: Number(this.blockRef)
            },
            (error, result) => {
              if (result) {
                this.setRawBlock(result)
              }
            }
          )
        }
        if (Number(this.lastMinedBlock.block.number) < Number(this.blockRef)) {
          this.isNotMinedBlock = true
        }
      }
    })
    if (this.blockRef.includes('0x')) {
      this.$socket.emit(
        sEvents.getBlock,
        {
          hash: this.blockRef.replace('0x', '')
        },
        (error, result) => {
          if (result) {
            this.setRawBlock(result)
          }
        }
      )
    } else {
      this.bNum = Number(this.blockRef)
      this.$socket.emit(
        sEvents.getBlockByNumber,
        {
          number: Number(this.blockRef)
        },
        (error, result) => {
          if (result) {
            this.setRawBlock(result)
          }
        }
      )
    }
  }
})
</script>
