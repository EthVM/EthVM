<template>
<div id="FramesMainFrame"
     class="main-frame">
  <MenusTop></MenusTop>
  <div class="section-container">
    <div class="container-fluid">
      <div class="row">
        <div class="block-menu-left col-md-3 col-lg-2">
          <MenusSide></MenusSide>
        </div>
        <div class="sections col-md-12 col-lg-10">
          <div class="section-padding">
            <FramesAbout v-if="pageName == 'about'"></FramesAbout>
            <FramesFAQ v-else-if="pageName == 'faq'"></FramesFAQ>
            <FramesContact v-else-if="pageName == 'contact'"></FramesContact>
            <FramesLastTransactions v-else-if="pageName == 'lasttransactions' || pageName == 'pendingTransactions'"
                                    :type="pageName"></FramesLastTransactions>
            <FramesLatestBlocks v-else-if="pageName == 'latestblocks'"></FramesLatestBlocks>
            <FramesIndividualTransaction v-else-if="pageName == 'tx' && param"
                                         :txHash="param"></FramesIndividualTransaction>
            <FramesBlock v-else-if="pageName == 'block' && param"
                         :blockHash="param"></FramesBlock>
            <FramesHome v-else></FramesHome>
          </div>
        </div>
      </div>
    </div>
    <!-- .container-fluid -->
  </div>
  <!-- .section-container -->
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
      </div>
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
      let _this = this
      if (!this.pageName) this.setPastData()
      else {
        setTimeout(()=>{
          _this.setPastData()
        },1000)
      }
    }
  },
  methods: {
    setPastData() {
      this.$socket.emit(sEvents.pastTxs, '', (_txs) => {
        this.$store.commit('NEW_TX', _txs)
        this.$eventHub.$emit(sEvents.pastTxsR)
        this.$eventHub.$emit(sEvents.newTx, new Tx(_txs[0]))
      })
      this.$socket.emit(sEvents.pastBlocks, '', (_blocks) => {
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
@import "~lessPath/NewHome/Frames/FramesMainFrame.less";
</style>
