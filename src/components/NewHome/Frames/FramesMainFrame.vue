<template>
  <div id="FramesMainFrame" class="main-frame">
    <MenusTop></MenusTop>

    <div class="section-container">
      <div class="container-fluid">
        <div class="row">
          <div class="block-menu-left col-md-3 col-lg-2">
            <MenusSide></MenusSide>
          </div>

          <div class="sections col-md-12 col-lg-10">
            <div class="section-padding">
              <FramesAbout                  v-if="pageName == 'about'">                   </FramesAbout>
              <FramesFAQ                    v-else-if="pageName == 'faq'">                </FramesFAQ>
              <FramesContact                v-else-if="pageName == 'contact'">            </FramesContact>
              
              <FramesLastTransactions       v-else-if="pageName == 'lasttransactions'">   </FramesLastTransactions>
              <FramesLatestBlocks           v-else-if="pageName == 'latestblocks'">       </FramesLatestBlocks>
              
              <FramesIndividualTransaction  v-else-if="pageName == 'tx' && param">        </FramesIndividualTransaction>
              <FramesBlock                  v-else-if="pageName == 'block' && param">     </FramesBlock>
              
              <FramesHome                   v-else>                                       </FramesHome>
            </div>
          </div>
        </div>
      </div><!-- .container-fluid -->
    </div><!-- .section-container -->

    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">

        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'FramesMainFrame',
    data () {
      return {
  
      }
    },
    computed: {
      pageName: function () {
        return this.$route.params.pageName
      },
      param: function () {
        return this.$route.params.param
      }
    },
    mounted: function () {
      console.log(this.param)
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Frames/FramesMainFrame.less";
</style>


