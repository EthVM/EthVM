<template>
  <v-container v-if="block != null" grid-list-lg class="mt-0">
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <v-card fluid flat color="transparent">
          <v-breadcrumbs large>
            <v-icon slot="divider">fa fa-arrow-right</v-icon>
            <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link"> {{ item.text }} </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12> <block-block-detail :block="block" :uncles="uncles"></block-block-detail> </v-flex>
    </v-layout>
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <block-last-transactions
          v-if="transactions.length > 0"
          :transactions="transactions"
          :frameTxs="true"
          :tableTitle="$t('title.blockTx')"
          class="mt-3"
        ></block-last-transactions>
        <v-card v-else flat color="white">
          <v-card-text class="text-xs-center text-muted">{{ $t('message.noTxInBlock') }} </v-card-text>
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
      bNum: null,
      uncles: [],
      unixtimestamp: null,
      timestamp: null,
      transactions: [],
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
    setBlock(result) {
      this.block = new Block(result)
      this.uncles = this.block.getUncles()
      this.setItems(this.block.getNumber())
      this.$socket.emit(
        sEvents.getBlockTransactions,
        {
          hash: this.blockRef.replace('0x', '')
        },
        (err, data) => {
          this.transactions = data.map(_tx => {
            return new Tx(_tx)
          })
        }
      )
    }
  },
  computed: {
    isUncle() {
      if (this.block && this.block.getIsUncle()) {
        return true
      }
      return false
    }
  },
  mounted() {
    /* Get Block Data: */
    if (this.blockRef.includes('0x')) {
      this.$socket.emit(
        sEvents.getBlock,
        {
          hash: this.blockRef.replace('0x', '')
        },
        (error, result) => {
          if (result) {
            this.setBlock(result)
          }
        }
      )
    } else {
      this.$socket.emit(
        sEvents.getBlockByNumber,
        {
          number: this.blockRef
        },
        (error, result) => {
          if (result) {
            this.setBlock(result)
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
