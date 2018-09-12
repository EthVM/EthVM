<template>
  <v-app>
    <navigation></navigation>
    <v-content>
      <v-container fluid>
        <!-- BODY -->
        <!-- Main Pages -->
        <frame-blocks v-if="pageName == 'blocks'"></frame-blocks>
        <frame-txs v-else-if="pageName == 'transactions' || pageName == 'pendingTransactions'" :type="pageName"></frame-txs>
        <frame-pending v-else-if="pageName == 'pending'" :type="pageName"></frame-pending>
        <frame-charts v-else-if="pageName == 'charts'"></frame-charts>
        <frame-about v-else-if="pageName == 'about'"></frame-about>

        <!--Detail Pages -->
        <frame-block-detail v-else-if="pageName == 'block' && param" :blockHash="param"></frame-block-detail>
        <frame-address v-else-if="pageName == 'address' && param" :address="param"></frame-address>
        <frame-tx-detail v-else-if="pageName == 'tx' && param" :txHash="param"></frame-tx-detail>
        <frame-token-detail v-else-if="pageName == 'token' && !holder" :tokenAddr="param"></frame-token-detail>
        <frame-token-detail v-else-if="pageName == 'token' && holder" :tokenAddr="param" :holderAddr="holder"></frame-token-detail>
        <!-- Hope Page -->
        <frame-home v-else></frame-home>
      </v-container>
         <!-- FOOTER -->
        <block-footer></block-footer>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import 'vuetify/dist/vuetify.min.css'
import sEvents from '@app/configs/socketEvents.json'
import { Block, Tx } from '@app/models'
import Vue from 'vue'

export default Vue.extend({
  name: 'FramesMainFrame',
  data() {
    return {}
  },
  created() {
    this.$options.sockets.connect = () => {
      if (!this.pageName || this.pageName === 'blocks' || this.pageName === 'transactions') {
        this.setPastData()
      } else {
        setTimeout(() => {
          this.setPastData()
        }, 1000)
      }
    }
  },
  methods: {
    setPastData() {
      this.$socket.emit(
        sEvents.pastTxs,
        {
          limit: 100,
          page: 0
        },
        (err, txs) => {
          this.$store.commit(sEvents.newTx, txs)
          if (txs && txs.length > 0) {
            this.$eventHub.$emit(sEvents.pastTxsR)
            this.$eventHub.$emit(sEvents.newTx, new Tx(txs[0]))
          }
        }
      )
      this.$socket.emit(
        sEvents.pastBlocks,
        {
          limit: 100,
          page: 0
        },
        (err, blocks) => {
          this.$store.commit(sEvents.newBlock, blocks)
          if (blocks && blocks.length > 0) {
            this.$eventHub.$emit(sEvents.newBlock, new Block(blocks[0]))
            this.$eventHub.$emit(sEvents.pastBlocksR)
          }
        }
      )
    }
  },
  computed: {
    pageName() {
      return this.$route.params.pageName
    },
    param() {
      return this.$route.params.param
    },
    holder() {
      return this.$route.params.holder
    }
  }
})
</script>
