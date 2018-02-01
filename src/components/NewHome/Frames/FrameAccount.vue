<template>
    <div class="frames-overview">
        <div class="row table-block">
            <div class="col-md-6 block-container">
                <div class="block">
                    <overview :address="address"></overview>
                </div>
                <div class="block">
                    <token-tracker></token-tracker>
                </div>
            </div>
            <div class="col-md-6 block-container">
                <div class="block">
                    <table-transactions-new :transactions="txs"></table-transactions-new>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FramesHome',
  props: ['address'],
  data () {
    return {}
  },
  created (){},
  computed:{
    txs(){
        if(this.$store.getters.getTxs.length) return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
        else return []
    }
  }
})
</script>
<style scoped lang="less">
@import "~lessPath/NewHome/Frames/FramesOverview.less";
</style>
