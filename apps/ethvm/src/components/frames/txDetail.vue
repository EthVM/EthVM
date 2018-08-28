<template>
  <div id="tx-detail">
    <div class="container">
      <!-- Page Title -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>{{ $t('title.txDetail') }}</h3>
          <h6 class="text-muted">{{ $t('subTitle.txDetail') }}</h6>
        </div>
        <div class="search-block">
          <block-search></block-search>
        </div>
        <!-- End Page Title -->
      </div>
      <!-- Tx Details -->
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <block-tx-detail :tx="transaction"></block-tx-detail>
        </div>
        <!-- End Tx Details -->
      </div>
      <!-- Fix this - get sub tx
          <div class="col-md-12 col-sm-12 col-xs-12" >
            <div class="block-title-container">
              <h3>Sub Transactions</h3>
            </div>
            <div class="block">
              <block-last-transactions :tx="transactions"></block-last-transactions>
            </div>
          </div>
        -->
    </div>
  </div>
</template>

<script lang="ts">
import { common} from '@app/libs'
import { Block, Tx } from '@app/models'
import chartOptions from '@app/sampleData/chartData.json'
import store from '@app/states'
import Vue from 'vue'
import sEvents from '@app/configs/socketEvents.json'

export default Vue.extend({
  name: 'tx-Detail',
  props: ['txHash'],
  data() {
    return {
      store,
      common,
      transaction: null,
      unixtimestamp: null,
      timestamp: null
    }
  },
  mounted() {
    /* Get Tx Info */
    this.$socket.emit(sEvents.getTx, { hash: this.txHash }, (err, data) => {
      if (data) {
        this.transaction = new Tx(data)
        /* Method to get Subtransactions: */
      }
    })
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
