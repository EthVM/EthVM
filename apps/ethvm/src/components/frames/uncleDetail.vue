<template>
  <v-container v-if="block != null" grid-list-lg class="mt-0">
    <v-card fluid flat color="transparent">
      <v-breadcrumbs large>
        <v-icon slot="divider">fa fa-arrow-right</v-icon>
        <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link">
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-card>
    <h4 class="mt-5">{{ $t('title.blockDetail') }}</h4>
    <block-block-detail :block="block" :uncles="uncles"></block-block-detail>
    <h4>{{ $t('title.blockTx') }}</h4>
    <block-last-transactions v-if="transactions.length > 0" :transactions="transactions" :showHeader="true" class="mt-3"></block-last-transactions>
    <v-card v-else color="white">
      <v-card-text class="text-xs-center text-muted">{{ $t('message.noTxInBlock') }} </v-card-text>
    </v-card>
  </v-container>
</template>



<script lang="ts">
import { common } from '@app/helpers'
import { Block, Tx } from '@app/models'
import chartOptions from '@app/sampleData/chartData.json'
import sEvents from '@app/configs/socketEvents.json'
import store from '@app/states'
import Vue from 'vue'

export default Vue.extend({
  name: 'Block',
  props: ['blockHash'],
  data() {
    return {
      common,
      store,
      options: chartOptions,
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
          text: 'Uncles',
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
    this.$socket.emit(
      sEvents.getBlock,
      {
        hash: this.blockHash
      },
      (error, result) => {
        if (result) {
          this.block = new Block(result)

          this.setItems(this.block.getNumber())
          // const uncleHashes = this.block.getUncleHashes()
          /*Get Transactions for the block: */
          this.$socket.emit(
            sEvents.getBlockTransactions,
            {
              hash: this.blockHash
            },
            (err, data) => {
              this.transactions = data.map(_tx => {
                return new Tx(_tx)
              })
            }
          )
          // uncleHashes.forEach((_hash: any, idx: number) => {
          //   this.$socket.emit(
          //     sEvents.getBlock,
          //     {
          //       hash: _hash.toBuffer()
          //     },
          //     (err, data) => {
          //       this.uncles.push(new Block(data))
          //     }
          //   )
          // })
        }
      }
    )
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
