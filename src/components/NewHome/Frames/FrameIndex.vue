<template>
<div>
  <!-- Navigatin Bar -->
  <nav class="fixed-top">
    <div class="mobile-menu">
      <MenusTop></MenusTop>
    </div>
  </nav>
  <!-- End Navigation Bar -->
  <!-- Side Menu -->
  <div class="side-menu">
    <MenusSide></MenusSide>
  </div>
  <!-- Side Menu -->
  <!-- DashBoard Content: -->
  <div class="main-content"
       id="main">
    <frame-about v-if="pageName == 'about'"></frame-about>
    <framefaq v-else-if="pageName == 'faq'"></framefaq>
    <frame-contact v-else-if="pageName == 'contact'"></frame-contact>
    <frame-transactions v-else-if="pageName == 'transactions' || pageName == 'pendingTransactions'"
                            :type="pageName"></frame-transactions>
    <frame-blocks v-else-if="pageName == 'blocks'"></frame-blocks>
    <frame-transaction v-else-if="pageName == 'tx' && param"
                                 :txHash="param"></frame-transaction>
    <frame-block v-else-if="pageName == 'block' && param"
                 :blockHash="param"></frame-block>
    <frame-account v-else-if="pageName == 'account' && param"
                   :blockHash="param"></frame-account>
    <frame-home v-else></frame-home>
  </div>
</div>
</div>

</template>

<script lang="ts">
import Vue from 'vue';
import sEvents from '@/configs/socketEvents.json';
import { Tx, Block } from '@/libs';
export default Vue.extend({
  name: 'FramesMainFrame',
  data() {
    return {}
  },
  created() {
    this.$options.sockets.connect = () => {
      let parent = this
      if (!this.pageName || this.pageName === 'blocks' || this.pageName === 'transactions') {
        this.setPastData()
      } else {
        setTimeout(() => {
          parent.setPastData()
        }, 1000)
      }
    }
  },
  methods: {
    setPastData() {
      this.$socket.emit(sEvents.pastTxs, '', (_err, _txs) => {
        this.$store.commit('NEW_TX', _txs)
        this.$eventHub.$emit(sEvents.pastTxsR)
        this.$eventHub.$emit(sEvents.newTx, new Tx(_txs[0]))
      })
      this.$socket.emit(sEvents.pastBlocks, '', (_err, _blocks) => {
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
    }
  },
  mounted: function() {}
})

</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Frames/MainFrameComponent.less";
</style>
