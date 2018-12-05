<template>
  <v-container grid-list-lg class="mt-0">
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <v-card fluid flat color="transparent">
          <v-breadcrumbs large>
            <v-icon slot="divider">fa fa-arrow-right</v-icon>
            <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link">{{ item.text }}</v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex v-if="blockMined" xs12> <block-block-detail :block="block" :isNotMinedBlock ="isNotMinedBlock" :isMined="true"></block-block-detail> </v-flex>
      <v-flex v-else xs12> <block-block-detail :isMined="false" :isNotMinedBlock ="isNotMinedBlock" :prev="getPrev()"></block-block-detail> </v-flex>
    </v-layout>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex v-if="blockMined" xs12>
        <block-last-transactions
          v-if="transactions.length > 0"
          :transactions="transactions"
          :frameTxs="true"
          :tableTitle="$t('title.blockTx')"
          class="mt-3"
        ></block-last-transactions>
        <v-card v-else flat color="white">
          <v-icon v-if="transactionLoading" class=" text-xs-center fa fa-spinner fa-pulse fa-4x fa-fw primary--text" large></v-icon>
          <v-card-text v-if="transactionLoading" class="text-xs-center text-muted">{{ $t('block.loadingBlockTx') }}</v-card-text>
          <v-card-text v-else class="text-xs-center text-muted">{{ $t('message.noTxInBlock') }}</v-card-text>
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

export default Vue.extend({
  name: 'Block',
  props: {
    blockRef: {
      type: String
    }
  },
  data() {
    return {
      common,
      store,
      block: null,
      bNum: Number,
      uncles: [],
      unixtimestamp: null,
      timestamp: null,
      transactions: [],
      transactionLoading: Boolean,
      isNotMinedBlock: Boolean,
      items: [
        {
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
        {
          text: this.$i18n.t('title.blocks'),
          disabled: false,
          link: '/blocks'
        }
      ],
      details: []
    }
  },
  methods: {
    setItems(num) {
      const newText = this.$i18n.t('title.blockN') + ' ' + num
      const newI = {
        text: newText,
        disabled: false,
        link: '/'
      }
      this.items.push(newI)
    },
    setRawBlock(result) {
      this.block = new Block(result)
      this.setBlock()
    },
    setBlock() {
      this.uncles = this.block.getUncles()
      if (!this.bNum) {
        this.bNum = this.block.getNumber()
        this.setItems(this.bNum.toString())
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
    isUncle() {
      if (this.block && this.block.getIsUncle()) {
        return true
      }
      return false
    },
    blockMined() {
      console.log('mined in frame', this.block)
      return this.block
    }
  },
  mounted() {
    this.transactionLoading = true
    /* Get Block Data: */
    if (this.$store.getters.getBlocks.length > 0) {
      this.lastMinedBlock = this.$store.getters.getBlocks[0]
    }
    this.$eventHub.$on(sEvents.newBlock, _block => {
      if (this.$store.getters.getBlocks.length > 0) {
        this.lastMinedBlock = this.$store.getters.getBlocks[0]
        if (this.lastMinedBlock < Number(this.blockRef)){
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
      this.setItems(this.bNum.toString())
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

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
