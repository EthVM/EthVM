<template>
<div class="overview">
  <div class="block-container">
    <div class="section-block-container">
      <p class="block-title">Overview</p>
      <div class="section-block">        
          <li>Address</li>
          <li>{{account.address}}</li>
          <li>Balance</li>
          <li>{{account.balance.toEth()}}</li>
      </div>
    </div>
    <!-- .section-block-container -->
  </div>
  <!-- .block-container -->
</div>
</template>

<template>
    <div class="block-detail">
        <div class="block-detail-container" v-if="account">
            <div class="details">
                <div>
                    <li>Address</li>
                    <li>{{account.address}}</li>
                </div>
                <div>
                    <li>Balance</li>
                    <li>{{account.balance.toEth()}}</li>
                    
                </div>
                <div>
                    <li>Number of Tx</li>
                    <li>Some number here ;)</li>
                </div>

          
            </div>
            <!-- .details -->
        </div>
        <!-- .block-detail-container -->
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
const MAX_ITEMS = 20
export default Vue.extend({
  name: 'AccountOverview',
  props: ['account'],
  data () {
    return {}
  },
  created (){},
  computed:{},
  methods: {
    getBalance(balance){;
    }
  }
})
</script>

<style scoped="" lang="less">
  @import "~lessPath/sunil/blocks/largeBlocks/blockDetail.less";
</style>