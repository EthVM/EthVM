<template>
  <div id="base-container">
    <!-- HEADER -->
    <block-header :pagename="pageName"></block-header>

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

    <!-- FOOTER -->
    <block-footer></block-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import { Tx, Block } from '@/libs'

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
      this.$socket.emit(sEvents.pastTxs, '', (_err, _txs) => {
        console.log('Past TX: ', _txs)

        this.$store.commit('NEW_TX', _txs)
        this.$eventHub.$emit(sEvents.pastTxsR)
        this.$eventHub.$emit(sEvents.newTx, new Tx(_txs[0]))
      })
      this.$socket.emit(sEvents.pastBlocks, '', (_err, _blocks) => {
        console.log('Past Blocks: ', _blocks)

        this.$store.commit('NEW_BLOCK', _blocks)
        this.$eventHub.$emit(sEvents.newBlock, new Block(_blocks[0]))
        this.$eventHub.$emit(sEvents.pastBlocksR)
      })
    }
  },
  computed: {
    pageName: function() {
      return this.$route.params.pageName
    },
    param: function() {
      return this.$route.params.param
    },
    holder: function() {
      return this.$route.params.holder
    }
  },
  mounted: function() {}
})
</script>

<style lang="less">
@import '~lessPath/sunil/global.less';
</style>

<style scoped lang="less">
@import '~lessPath/sunil/index.less';
</style>
